import { parser } from "./syntax.grammar"
import { LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent } from "@codemirror/language"
import { styleTags, tags as t } from "@lezer/highlight"

const keywords = ["let", "as", "qualified", "if", "then", "else", "do", "end", "import", "from", "struct", "value", "trait", "for", "impl", "satisfies", "is", "when", "of", "external"];
const specialTypes = ["Self", "IO", "Any"];

export const IndigoLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        DoBlock: delimitedIndent({ closing: "end", align: false })
      }),
      foldNodeProp.add({
        DoBlock: foldInside
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
        StringConcatOperator: t.arithmeticOperator,
        "Definition/LValue/Identifier": t.definition(t.function(t.variableName)),
        Identifier: t.variableName,
        "Type/Identifier": t.typeName,
        "GenericType/Identifier": t.typeName,
        List: t.typeName,
        "Parameter/Identifier": t.variableName,
        "Lambda/ParameterSection/Parameter/Identifier": t.variableName,
        "Import/Identifier": t.namespace,
        "Struct/Identifier": t.typeName,
        "ValueStruct/Identifier": t.typeName,
        "StructInstantiation/Identifier": t.typeName,
        "StructField/Identifier": t.variableName,
        "FieldAccess/Identifier": [t.variableName, t.propertyName],
        "Cast/Type/Identifier": t.typeName,
        "isTypes/Type/Identifier": t.typeName,
        Number: t.number,
        Float: t.number,
        ListLiteral: t.squareBracket,
        "( )": t.paren,
        "[ ]": t.squareBracket,
        "{ }": t.brace,
        ...(Object.fromEntries(keywords.map(kw => [kw, t.keyword]))),
        ...(Object.fromEntries(specialTypes.map(st => [st, t.typeName])))
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
