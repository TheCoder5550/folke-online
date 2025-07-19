import Backend.TypeChecker (checkJsonString)
import Backend.Types (Result(..), Error(..))

import Foreign (Ptr)
import Foreign.C.Types (CChar)
import Foreign.C (peekCStringLen, newCString)

import Data.Maybe (maybe)

foreign export javascript "checkJsonString"
  checkJsonStringWrapper :: Ptr CChar -> Int -> IO (Ptr CChar)

foreign export javascript "my_fac"
  fac :: Word -> Word

main :: IO ()
main = pure ()

fac :: Word -> Word
fac 0 = 1
fac n = n * fac (n - 1)

checkJsonStringWrapper :: Ptr CChar -> Int -> IO (Ptr CChar)
checkJsonStringWrapper ptr len = do
  jsonData <- peekCStringLen (ptr, len)

  let outString = case (checkJsonString jsonData) of
                    Ok _ _ -> "{ \"correct\": true }"
                    Err _ _ err -> "{ \"correct\": false, \"message\": \"" ++ errMessage err ++ maybe "" (": " ++) (errContext err) ++ "\", \"location\": " ++ maybe "\"global\"" show (errLocation err) ++ " }"

  newCString outString