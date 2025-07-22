{-# LANGUAGE TemplateHaskell #-}

import Backend.TypeChecker (checkJsonString)
import Backend.Types (Result(..), Error(..))

import Foreign (Ptr)
import Foreign.C.Types (CChar)
import Foreign.C (peekCStringLen, newCString)

import Data.Maybe (maybe)
import Data.Aeson ( encode )
import Data.Aeson ( defaultOptions )
import Data.Aeson.TH ( deriveJSON )
import Data.ByteString.Lazy.Char8 (unpack)

data JSONResult = JSONResult {
  correct :: Bool,
  message :: Maybe String,
  location :: Maybe String
} deriving (Show, Eq)

$(deriveJSON defaultOptions ''JSONResult)

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

  let outJSON = case (checkJsonString jsonData) of
                    Ok _ _ -> JSONResult { correct = True, message = Nothing, location = Nothing }
                    Err _ _ err ->JSONResult { correct = False, message = Just (errMessage err ++ maybe "" (": " ++) (errContext err)), location = Just (maybe "global" show (errLocation err)) }

  let outString = unpack (encode outJSON)

  newCString outString