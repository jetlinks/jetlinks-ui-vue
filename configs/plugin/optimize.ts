import fs from "fs";
import path from "path";

const rootPath = path.resolve(__dirname, '../../');

function optimizeComponents(moduleName: string): string[] {
  const moduleESPath = `${moduleName}/es`;
  const nodeModulePath = `./node_modules/${moduleESPath}`;
  const includes: string[] = [moduleESPath];
  
  const folders = fs.readdirSync(path.resolve(rootPath, nodeModulePath));

  folders.map((name) => {

    const folderName = path.resolve(rootPath, nodeModulePath, name);
    let stat = fs.lstatSync(folderName);
    if (stat.isDirectory()) {
      let styleFolder = path.resolve(folderName, "style");
      if (fs.existsSync(styleFolder)) {
        let _stat = fs.lstatSync(styleFolder);
        if (_stat.isDirectory()) {
          includes.push(`${moduleESPath}/${name}/style`);
        }
      }
    }
  });

  return includes;
}

export function optimizeDeps() {
  return {
    name: "optimizeDeps",
    configResolved: async (config) => {
      const components = [
        ...optimizeComponents("ant-design-vue"),
        ...optimizeComponents("@jetlinks-web/components"),
      ];
      let concat = config.optimizeDeps.include.concat(components);
      config.optimizeDeps.include = Array.from(new Set(concat));
    },
  };
}
