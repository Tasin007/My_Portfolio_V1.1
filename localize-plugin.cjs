// Wrap rendered text in React components rather than mutating React-owned DOM nodes.
module.exports = function ({ types: t }) {
  const include = (state) => {
    const name = state.file.opts.filename.replace(/\\/g, "/");
    return name.includes("/src/") && !name.endsWith("/localization.jsx");
  };
  return {
    visitor: {
      Program: {
        exit(path, state) {
          if (!include(state)) return;
          path.unshiftContainer(
            "body",
            t.importDeclaration(
              [t.importSpecifier(t.identifier("__L"), t.identifier("L"))],
              t.stringLiteral("/src/localization.jsx"),
            ),
          );
        },
      },
      JSXText(path, state) {
        if (!include(state) || !path.node.value.trim()) return;
        const value = path.node.value.replace(/\s+/g, " ");
        path.replaceWith(
          t.jsxElement(
            t.jsxOpeningElement(
              t.jsxIdentifier("__L"),
              [
                t.jsxAttribute(
                  t.jsxIdentifier("value"),
                  t.jsxExpressionContainer(t.stringLiteral(value)),
                ),
              ],
              true,
            ),
            null,
            [],
            true,
          ),
        );
        path.skip();
      },
      JSXExpressionContainer: {
        exit(path, state) {
          if (
            !include(state) ||
            path.listKey !== "children" ||
            t.isJSXEmptyExpression(path.node.expression)
          )
            return;
          path.replaceWith(
            t.jsxElement(
              t.jsxOpeningElement(
                t.jsxIdentifier("__L"),
                [
                  t.jsxAttribute(
                    t.jsxIdentifier("value"),
                    t.jsxExpressionContainer(path.node.expression),
                  ),
                ],
                true,
              ),
              null,
              [],
              true,
            ),
          );
          path.skip();
        },
      },
    },
  };
};
