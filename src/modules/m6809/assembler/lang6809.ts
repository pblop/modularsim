// based on https://github.com/codemirror/legacy-modes/blob/main/mode/z80.js
// not my best work...
import type { StreamParser } from "@codemirror/language";

type Lang6809State = {
  context: "start" | "arguments" | "done";
};

function mk6809(): StreamParser<Lang6809State> {
  const mnemonics =
    /^(abx|adca|adcb|adda|addb|addd|anda|andb|andcc|asr|asra|asrb|beq|lbeq|bge|lbge|bgt|lbgt|bhi|lbhi|bcc|lbcc|bita|bitb|ble|lble|blo|lbcs|bls|lbls|blt|lblt|bmi|lbmi|bne|lbne|bpl|lbpl|bra|lbra|brn|lbrn|bsr|lbsr|bvc|lbvc|bvs|lbvs|clr|clra|clrb|cmpa|cmpb|cmpd|cmps|cmpu|cmpx|cmpy|com|coma|comb|cwai|daa|dec|deca|decb|eora|eorb|exg|inc|inca|incb|jmp|jsr|lda|ldb|ldd|lds|ldu|ldx|ldy|leas|leau|leax|leay|lsl|lsla|lslb|lsr|lsra|lsrb|mul|neg|nega|negb|nop|ora|orb|orcc|pshs|pshu|puls|pulu|reset|rol|rola|rolb|ror|rora|rorb|rti|rts|sbca|sbcb|sex|sta|stb|std|sts|stu|stx|sty|suba|subb|subd|swi|swi2|swi3|sync|tfr|tst|tsta|tstb)\b/i;
  const registers = /^(a|b|d|x|y|u|s|dp|cc)\b/i;
  const numbers = /^(0x[\da-f]+|[0-7]+|[01]+b|\d+d?)\b/i;

  return {
    name: "lang6809",
    startState: () => ({
      context: "start",
    }),
    token: (stream, state) => {
      if (!stream.column()) state.context = "start";
      if (stream.eatSpace()) return null;

      let word: string | void;
      if (stream.eatWhile(/\w/)) {
        if (stream.eat(".")) {
          stream.eatWhile(/\w/);
        }
        word = stream.current();

        if (stream.eat(":")) {
          state.context = "start";
          return "label";
        } else if (stream.match(numbers)) {
          return "number";
        } else {
          if (state.context === "arguments") {
            if (registers.test(word)) {
              state.context = "arguments";
              return "variableName.special";
            }
          }

          if (mnemonics.test(word)) {
            state.context = "arguments";
            return "keyword";
          } else if (numbers.test(word)) {
            return "number";
          }
          return null;
        }
      } else if (stream.eat(";")) {
        stream.skipToEnd();
        return "comment";
      } else if (stream.eat('"')) {
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        while ((word = stream.next())) {
          if (word === '"') break;

          if (word === "\\") stream.next();
        }
        return "string";
      } else if (stream.eat("'")) {
        if (stream.match(/\\?.'/)) return "number";
      } else if (stream.eat(".")) {
        state.context = "done";
        if (stream.eatWhile(/\w/)) return "def";
      } else if (stream.eat("$")) {
        if (stream.eatWhile(/[01]/)) return "number";
      } else {
        stream.next();
      }
      return null;
    },
  };
}

export const lang6809 = mk6809();
