foreign export javascript "my_fac"
  fac :: Word -> Word

main :: IO ()
main = pure ()

fac :: Word -> Word
fac 0 = 1
fac n = n * fac (n - 1)