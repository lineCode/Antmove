const { useReducer } = require("@amove/next");
const fs = require("fs-extra");
const path = require("path");
useReducer({
    AppWxss (node, store) {
        this.$node.content = fs.readFileSync(node.body.path, "utf8");
        let output = path.join(store.config.output, node.body.projectPath);
        if (!this.$node.content) {
            this.$node.content = `/*${node.filePath}*/`;
        }
        this.addChild("AppImportExpresstion");
        this.addChild({
            type: "ProcessCss",
            key: node.path + "ProcessCss",
            dist: output,
            body: node.body,
        });
    },
    // transformAppCss(node, store) {
    //     let code = this.$node.content;
    //     const entry = path.join(__dirname, `../../../runtime/static`);
    //     const Config = store.config.preAppData.config;
    //     const customComponentPrefix = Config.library.customComponentPrefix;
    //     fs.copy(
    //         entry,
    //         path.join(store.config.output, `${customComponentPrefix}/static`),
    //         function (err) {
    //             if (err) console.error(err);
    //         }
    //     );
    //     const cssStyle = `
    //       @import '${customComponentPrefix}/static/app.acss';
    //     `;
    //     this.$node.content = cssStyle + "\n" + code;
    // },
    AppImportExpresstion (node, store) {
        const Config = store.config.preAppData.config;
        const customComponentPrefix = Config.library.customComponentPrefix;
        const entry = path.join(__dirname, `../../../runtime/static`);
        let code = this.$node.content;
        fs.copy(
            entry,
            path.join(store.config.output, `${customComponentPrefix}/static`),
            function (err) {
                if (err) console.error(err);
            }
        );
        const cssStyle = `
        @import '${customComponentPrefix}/static/app.acss';
      `;
        this.$node.content = cssStyle + "\n" + code;
    },
});
