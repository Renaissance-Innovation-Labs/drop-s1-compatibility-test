import fs from "fs"
import util from "util"
import Handlebars from "handlebars"

class FileHandler {
    static async templateReader(file: string, info?: any): Promise<string> {
        let templateFile = ""
        try {
            const readFile = util.promisify(fs.readFile);
            templateFile = await readFile(`${process.cwd()}/src/view/${file}`, "utf-8")
        } catch (err: unknown) {
            if (err instanceof Error) throw err
        }
        const template = Handlebars.compile(templateFile)
        return template({ ...info });
    }
}

export default FileHandler