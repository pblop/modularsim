import { verify } from "../../../utils/config.js";
import { element, iconButton } from "../../../utils/html.js";
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
import AssemblerLinker from "./assnlink.js";

type AssemblerUIConfig = {
  content?: string;
};

const AssemblerUIStrings = createLanguageStrings({
  en: {
    build: "Assemble and link",
  },
  es: {
    build: "Ensamblar y enlazar",
  },
});

class AssemblerUI implements IModule {
  id: string;
  event_transceiver: TypedEventTransceiver;

  config: AssemblerUIConfig;

  panel?: HTMLElement;
  textArea?: HTMLTextAreaElement;

  language!: string;
  localeStrings!: typeof AssemblerUIStrings.en;

  getModuleDeclaration(): ModuleDeclaration {
    return {
      events: {
        provided: [],
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
    try {
      const inputText = this.textArea?.value || "";
      const inputU8Arr = AssemblerLinker.textToUint8Array(inputText);
      const rel = await AssemblerLinker.assemble(inputU8Arr);

      console.log(`[${this.id}] Linking result:`, rel);
    } catch (error) {
      console.error(`[${this.id}] Error during linking:`, error);
    } finally {
      this.isRunningBuild = false;
    }
  };
  performBuild = () => {
    // Ensure only one build operation is in progress at a time
    if (this.isRunningBuild) return;
    this._performBuild();
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement, language: string) => {
    if (panel_id !== this.id) return;

    this.panel = panel;
    this.panel.classList.add("assembler-ui");

    this.textArea = this.panel.appendChild(
      element("textarea", {
        textContent: this.config.content || "",
      }),
    );

    this.panel.appendChild(
      element(
        "div",
        {
          className: "aui-overlay",
        },
        iconButton("build", "Build", this.performBuild),
      ),
    );

    this.setLanguage(language);
  };
}

export default AssemblerUI;
