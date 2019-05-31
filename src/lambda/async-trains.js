const request = require('request')

export async function handler(event, context, callback) {
  request.post('http://api.trafikinfo.trafikverket.se/v1.2/data.json', {
    body: `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
  <QUERY objecttype='TrainAnnouncement'>
    <FILTER>
      <AND>
        <IN name='ProductInformation' value='Pendeltåg' />
        <EQ name='ActivityType' value='Avgang' />
        <GT name='AdvertisedTimeAtLocation' value='$dateadd(0:00:00)' />
        <LT name='AdvertisedTimeAtLocation' value='$dateadd(0:19:00)' />
      </AND>
    </FILTER>
    <INCLUDE>AdvertisedTrainIdent</INCLUDE>
  </QUERY>
</REQUEST>`, headers: {
      'Content-Type': 'application/xml'
    }
  }, (error, res) => {
    if (error) {
      callback(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    callback(null, {
      statusCode: 200, body: res.body
    })
  })
}
