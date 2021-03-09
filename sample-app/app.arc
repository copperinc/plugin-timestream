@app
plugin-timestream-demo

@http
get /

@static
fingerprint true

@tables
data
  dateval *Number

@timestream
test-table

@plugins
copper/plugin-timestream
