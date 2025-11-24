import { parser } from "./syntax.grammar"
import { LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent } from "@codemirror/language"
import { styleTags, tags as t } from "@lezer/highlight"

const keywords = ["let", "as", "qualified", "if", "then", "else", "do", "end", "import", "struct", "trait", "for", "impl", "satisfies", "is", "when", "of"];

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
        CharLiteral: t.string,
        LineComment: t.lineComment,
        BlockComment: t.blockComment,
        AssignmentOperator: t.definitionOperator,
        ArithmeticOperator: t.arithmeticOperator,
        ComparisonOperator: t.compareOperator,
        BooleanOperator: t.logicOperator,
        "Definition/LValue/Identifier": t.definition(t.functionName),
        "Application/BaseExpression/Identifier": t.functionName,
        "Application/expression/Identifier": t.variableName,
        "Type/Identifier": t.typeName,
        "GenericType/Identifier": t.typeName,
        "Parameter/Identifier": t.variableName,
        "Lambda/ParameterSection/Parameter/Identifier": t.variableName,
        "Import/Identifier": t.namespace,
        Number: t.number,
        ListLiteral: t.squareBracket,
        "( )": t.paren,
        "[ ]": t.squareBracket,
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
