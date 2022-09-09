// let request = require('request');
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,InputGroup,FormControl,Row,Button,Card} from 'react-bootstrap';
import { useState,useEffect } from 'react';
function App() {
  const [searchInput, setsearchInput] = useState("");
  const [accessToken , setaccessToken] = useState("");
  const [albums,setalbums] = useState("");
  const client_id = "53ede69fde1743b9a76911c4633ffcda";
  const client_secret = "c389f54f0bd444528c698d7d66c88f68";
 
  useEffect(() => {
    let authParameter={
      method:'POST',
      body: 'grant_type=client_credentials&client_id='+client_id+'&client_secret='+client_secret,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

    }
    fetch("https://accounts.spotify.com/api/token",authParameter)
    .then(result=>
      {
        result.json();
      })
      .then(data=>
        { 
          setaccessToken(data.access_token);
        })
  }, [])
  async function search()
  {
    console.log("Search for "+ searchInput);
  
  //Get request using search to get the artist Id
  let searchParameters = {
    method : 'GET',
    headers:
    {
      'Content-Type':'application/json',
      'Authorization':'Bearer' + accessToken
    }
  }
  let artistID = await fetch('https://api.spotify.com/v1/search?q='+searchInput+'&type=artist',searchParameters)
  .then(response=>
    response.json())
    .then(data=>
      {
        return data.artists.item[0].id
      })
      console.log("Artist Id is :" +artistID);
      //Get request with artists Id grab all the albums from that artist
      let returnedAlbums = await fetch('https://api.spotify.com/v1/search?q='+searchInput+'&type=artist',searchParameters)
      .then(response=>
        {
          response.json();
        })
        .then(data=>
          {
            console.log(data);
            setalbums(data.items)
          })
}
  return (
<div className='App my-2'>
<Container>
 <InputGroup className="mb-3" size="lg">
     <FormControl
    placeholder = "Search For Artists and Songs"
    type="input"
    onKeyPress={(event)=>
    {
      if(event.key=="Enter")
      {
        search();
      }
    }}
    onChange={(event)=>
    {
      setsearchInput(event.target.value);
    }}
  />
  <Button onClick={search}>
      Search
  </Button> 
 </InputGroup>
</Container>
<Container>
  <Row className='mx-2 row row-cols-4'>
    {
      Array.from(albums).map((album,i)=>
      {
        return (
          <Card className='mx-2 my-2'>
          <Card.Img src={album.images[0].url}/>
          <Card.Body>
           <Card.Title>
             {album.name}
           </Card.Title>
          </Card.Body>
         </Card>
        )
      }
    )}
  </Row>
 
</Container>
</div>
  )};

export default App;
