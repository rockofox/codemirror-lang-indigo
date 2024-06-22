import { parser } from "./syntax.grammar"
import { LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent } from "@codemirror/language"
import { styleTags, tags as t } from "@lezer/highlight"

const keywords = ["let", "as", "qualified", "if", "then", "else", "do", "end", "import", "struct", "trait", "for", "impl"];

export const IndigoLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ")", align: false })
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        Boolean: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        BlockComment: t.blockComment,
        AssignmentOperator: t.definitionOperator,
        ArithmeticOperator: t.arithmeticOperator,
        ComparisonOperator: t.compareOperator,
        BooleanOperator: t.logicOperator,
        "Definition/LValue/Identifier": t.definition(t.variableName),
        "Type/Identifier": t.typeName,
        Number: t.number,
        "( )": t.paren,
        ...(Object.fromEntries(keywords.map(kw => [kw, t.keyword])))
      }),
    ]
  }),
  languageData: {
    commentTokens: { line: "#", block: { open: "/*", close: "*/" } },
  }
})

export function indigo() {
  return new LanguageSupport(IndigoLanguage)
}
