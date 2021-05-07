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
simple-table
complex-table
  MagneticStoreRetentionPeriodInDays 27
  MemoryStoreRetentionPeriodInHours 42

@plugins
copper/plugin-timestream
