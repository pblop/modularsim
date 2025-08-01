import { verify } from "../../../utils/config.js";
import { element, icon, iconButton } from "../../../utils/html.js";
import { createLanguageStrings } from "../../../utils/lang.js";
import { UpdateQueue } from "../../../utils/updatequeue.js";
import type {
  EventContext,
  EventDeclaration,
  TypedEventTransceiver,
} from "../../../types/event.js";
import type { IModule, ModuleDeclaration } from "../../../types/module.js";
import type { ISimulator } from "../../../types/simulator.js";
import type { Registers } from "../cpu/cpu_parts.js";
import { AssemblerLinker, type AsxxxxError, type AssemblerLinkerError } from "./assnlink.js";

import { EditorView, basicSetup } from "https://esm.sh/codemirror@6.0";
import { keymap } from "https://esm.sh/@codemirror/view@6";
import { type Diagnostic, setDiagnostics } from "https://esm.sh/@codemirror/lint@6";
import { indentWithTab } from "https://esm.sh/@codemirror/commands@6.8";
import {
  StreamLanguage,
  HighlightStyle,
  syntaxHighlighting,
} from "https://esm.sh/@codemirror/language@6";
import { tags } from "https://esm.sh/@lezer/highlight@1.2.1";
import { lang6809 } from "./lang6809.js";
import { catppuccinLatte } from "https://esm.sh/@catppuccin/codemirror";

const STATUS_ICON_ANIMATION_DURATION = 5000; // 5 seconds

type AssemblerUIConfig = {
  content?: string;
};

const AssemblerUIStrings = createLanguageStrings({
  en: {
    build: "Assemble and link",
    ok: "Assembly & linking finished successfully",
    error: "Assembly & linking failed",
  },
  es: {
    build: "Ensamblar y enlazar",
    ok: "Ensamblado y enlazado exitoso",
    error: "Ensamblado y enlazado fallido",
  },
});

class AssemblerUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;

  config: AssemblerUIConfig;

  panel?: HTMLElement;
  button?: HTMLButtonElement;
  statusIcon?: HTMLDivElement;
  retractStatusIconTimeoutId?: number;
  editor?: EditorView;

  language!: string;
  localeStrings!: typeof AssemblerUIStrings.en;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: ["dbg:program:load", "dbg:symbols:load"],
        required: {
          "gui:panel_created": this.onGuiPanelCreated,
        },
        optional: {},
      },
      cycles: {
        permanent: [],
      },
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;
    this.event_transceiver = eventTransceiver;

    this.config = verify(
      config,
      {
        content: {
          type: "string",
          default: "",
          required: false,
        },
      },
      `[${this.id}] configuration error: `,
    );

    console.log(`[${this.id}] Module initialized.`);
  }

  setLanguage(language: string): void {
    this.language = language;
    this.localeStrings = AssemblerUIStrings[this.language] || AssemblerUIStrings.en;
  }

  isRunningBuild = false;
  _performBuild = async () => {
    this.isRunningBuild = true;
    this.button?.classList.add("active");
    // Stop any previous ok icon animation
    this.retractStatusIcon();

    try {
      const inputText = this.editor?.state.doc.toString() || "";
      const inputU8Arr = AssemblerLinker.textToUint8Array(inputText);
      const [rel, errors] = await AssemblerLinker.assemble(inputU8Arr);
      if (errors.length > 0) {
        console.error(`[${this.id}] Assembly errors:`, errors);
        return;
      }
      // console.log(`[${this.id}] Assembling result:`, AssemblerLinker.uint8ArrayToText(rel));
      const [s19, noi] = await AssemblerLinker.link(rel);

      const s19Text = AssemblerLinker.uint8ArrayToText(s19);
      const noiText = AssemblerLinker.uint8ArrayToText(noi);

      this.event_transceiver.emit("dbg:program:load", "s19", s19Text);
      this.event_transceiver.emit("dbg:symbols:load", "noice", noiText);

      // Set diagnostics from the assembly errors
      const diagnostics: Diagnostic[] = this.errorsToDiagnostics(errors);
      this.editor?.dispatch(setDiagnostics(this.editor!.state, diagnostics));

      // Show the ok icon with animation
      this.showStatusIcon("ok", this.localeStrings.ok);
    } catch (_error) {
      const error = _error as AssemblerLinkerError;
      console.error(`[${this.id}] Error during build:`, error);

      if (error.from === "assemble") {
        console.error(`[${this.id}] Assembly errors:`, error.errors);

        // Set diagnostics in the editor
        const diagnostics = this.errorsToDiagnostics(error.errors);
        this.editor?.dispatch(setDiagnostics(this.editor!.state, diagnostics));
      }
      this.showStatusIcon("fail", this.localeStrings.error);
    } finally {
      this.isRunningBuild = false;
      this.button?.classList.remove("active");
    }
  };
  performBuild = () => {
    // Ensure only one build operation is in progress at a time
    if (this.isRunningBuild) return;
    this._performBuild();
  };

  errorsToDiagnostics = (errors: AsxxxxError[]): Diagnostic[] => {
    return errors.map((err) => {
      const lineNum = err.line;
      const lineInfo = this.editor!.state.doc.line(lineNum);

      return {
        from: lineInfo.from,
        to: lineInfo.to,
        severity: "error",
        message: err.message,
      };
    });
  };

  showStatusIcon(iconName: string, titleString: string): void {
    if (!this.statusIcon) return;
    this.statusIcon.classList.add("move");
    const child = this.statusIcon.children[0] as HTMLSpanElement;
    child.title = titleString;
    child.className = `gui-icon ${iconName}`;

    this.retractStatusIconTimeoutId = window.setTimeout(() => {
      this.statusIcon?.classList.remove("move");
    }, STATUS_ICON_ANIMATION_DURATION);
  }
  retractStatusIcon = () => {
    if (this.retractStatusIconTimeoutId) {
      window.clearTimeout(this.retractStatusIconTimeoutId);
      this.retractStatusIconTimeoutId = undefined;
    }
    this.statusIcon?.classList.remove("move");
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string) => {
    if (panel_id !== this.id) return;

    this.setLanguage(language);

    this.panel = panel;
    this.panel.classList.add("assembler-ui");

    console.log(tags);

    const highlightStyle = HighlightStyle.define([
      { tag: tags.comment, class: "cmt-comment" },
      { tag: tags.keyword, class: "cmt-keyword" },
      { tag: tags.number, class: "cmt-number" },
      { tag: tags.definitionOperator, class: "cmt-def" },
      { tag: tags.string, class: "cmt-string" },
      { tag: tags.variableName, class: "cmt-variable-name" },
    ]);

    this.editor = new EditorView({
      extensions: [
        basicSetup,
        StreamLanguage.define(lang6809),
        keymap.of([indentWithTab]),
        syntaxHighlighting(highlightStyle),
      ],
      parent: this.panel,
      doc: this.config.content || "",
    });

    this.button = iconButton("build", this.localeStrings.build, this.performBuild);
    this.statusIcon = icon("ok", this.localeStrings.ok);

    this.panel.appendChild(
      element(
        "div",
        {
          className: "aui-overlay",
        },
        this.statusIcon,
        this.button,
      ),
    );

    this.setLanguage(language);
  };
}

export default AssemblerUI;
