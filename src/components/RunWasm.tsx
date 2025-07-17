import { useEffect } from "react"
import WASM_MODULE_URL from '../../haskell-proof-validator/output/hello.wasm?url'
import ghc_wasm_jsffi from "../../haskell-proof-validator/output/ghc_wasm_jsffi.js";
import { WASI, ConsoleStdout, OpenFile, File } from "@bjorn3/browser_wasi_shim";

export default function RunWasm() {
  useEffect(() => {
    async function loadWasm() {
      const args: string[] = [];
      const env: string[] = [];
      const fds = [
        new OpenFile(new File([])),
        ConsoleStdout.lineBuffered(msg => console.log(`[WASI stdout] ${msg}`)),
        ConsoleStdout.lineBuffered(msg => console.warn(`[WASI stderr] ${msg}`)),
      ];
      const wasi = new WASI(args, env, fds);
      const jsffiExports = {};

      const wasm = await WebAssembly.compileStreaming(fetch(WASM_MODULE_URL));
      const inst = await WebAssembly.instantiate(wasm, {
        "wasi_snapshot_preview1": wasi.wasiImport,
        "ghc_wasm_jsffi": ghc_wasm_jsffi(jsffiExports),
      });
      wasi.initialize(inst);

      console.log(await inst.exports.my_fac(5));
    }

    loadWasm();
  }, []);

  return (
    <span>Runnning wasm</span>
  )
}