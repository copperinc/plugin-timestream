@app
plugin-timestream-demo

@http
get /

@static
fingerprint true

@tables
data
  dateval *Number

@plugins
copper/plugin-timestream
