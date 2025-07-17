foreign export javascript "my_fac"
  fac :: Word -> Word
fac 0 = 1
fac n = n * fac (n - 1) 

main = putStrLn "hello world"