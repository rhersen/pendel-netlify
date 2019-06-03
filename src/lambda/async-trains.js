const request = require("request")

export function handler({ queryStringParameters }, context, callback) {
  request.post(
    "http://api.trafikinfo.trafikverket.se/v1.2/data.json",
    {
      body: getBody(queryStringParameters),
      headers: {
        "Content-Type": "application/xml"
      }
    },
    (error, res) => {
      if (error) {
        callback(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      callback(null, {
        statusCode: 200,
        body: res.body
      })
    }
  )
}

function getBody({ train, station = "Sst" }) {
  if (train) {
    return `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
  <QUERY objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation'>
    <FILTER>
      <AND>
      <IN name='ProductInformation' value='Pendeltåg' />
      <IN name='ActivityType' value='Avgang' />
      <EQ name='AdvertisedTrainIdent' value='${train}' />
      <GT name='AdvertisedTimeAtLocation' value='$dateadd(-6:00:00)' />
      <LT name='AdvertisedTimeAtLocation' value='$dateadd(6:00:00)' />
      </AND>
    </FILTER>
    <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
    <INCLUDE>LocationSignature</INCLUDE>
  </QUERY>
</REQUEST>`
  } else {
    return `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
  <QUERY objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation'>
    <FILTER>
      <AND>
      <IN name='ProductInformation' value='Pendeltåg' />
      <IN name='ActivityType' value='Avgang' />
      <EQ name='LocationSignature' value='${station}' />
      <GT name='AdvertisedTimeAtLocation' value='$dateadd(-0:15:00)' />
      <LT name='AdvertisedTimeAtLocation' value='$dateadd(1:00:00)' />
      </AND>
    </FILTER>
    <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
    <INCLUDE>AdvertisedTrainIdent</INCLUDE>
    <INCLUDE>ToLocation</INCLUDE>
  </QUERY>
</REQUEST>`
  }
}
