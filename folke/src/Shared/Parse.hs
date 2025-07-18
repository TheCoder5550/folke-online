{-# LANGUAGE OverloadedStrings, TemplateHaskell #-}
{-# OPTIONS_GHC -Wno-orphans #-}
{-# OPTIONS_GHC -Wno-name-shadowing #-}

module Shared.Parse (
  parseProofToJSON,
  parseProofFromJSON
) where

import qualified Data.Text as T
import Shared.FESequent (FEDocument(..))

import Data.Aeson ( decode )
import Data.ByteString.Builder(toLazyByteString)
import Data.Text.Encoding (encodeUtf8Builder)
import Data.Aeson.Encode.Pretty (encodePrettyToTextBuilder)
import Data.Text.Internal.Builder (toLazyText)
import Data.Text.Lazy (toStrict)

-- | Converts frontend sequent to a json string
parseProofToJSON :: FEDocument -> T.Text
parseProofToJSON = toStrict . toLazyText . encodePrettyToTextBuilder

-- | Converts a json string to a frontend sequent
parseProofFromJSON :: T.Text -> Maybe FEDocument
parseProofFromJSON = decode . toLazyByteString . encodeUtf8Builder