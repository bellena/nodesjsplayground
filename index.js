var request = require('request');

var https = require('https')
https.post = require('https-post');

// IAM joy:
// 1) ask the product and find it's SAMLRequest
// 2) go on IAM request (GET ) and push that SAMLRequest
// 3) POST the login
// 4) enjoy the APP!

var saml = ''
request('https://transwide.wktransportservices.com', function (error, response, body) {
	//console.log('error:', error); // Print the error if one occurred
	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	console.log('response', response.headers)
	//console.log('body:', body); // Print the HTML for the Google homepage.
	//extra SAMLRequest from body
	saml=body.substring(body.lastIndexOf("SAMLRequest\" value=\"")+"SAMLRequest\" value=\"".length, body.indexOf("\"", body.lastIndexOf("SAMLRequest\" value=\"")+"SAMLRequest\" value=\"".length ));
	console.log('SAMLRequest', saml)

		var result = '';
	/* the POST login can be deducted by reading the body response from the IAM login URL*/
	https.post('https://idp.wktransportservices.com/nidp/saml2/sso', { SAMLRequest: saml }, function (res){
	
			res.on('data', function (chunk) {
				result += chunk;
			});
			res.on('end', function () {
				console.log('GET IAM login body:', result); // Print the HTML for the Google homepage.

				https.post('https://idp.wktransportservices.com/nidp/app/login?id=124&sid=0&option=credential&sid=0', { SAMLRequest: saml /*Ecom_User_ID: 'ABADMPROD', Ecom_Password: '' */}, function(res){
					var result = '';
					res.on('data', function (chunk) {
						result += chunk;
					});
					res.on('end', function () {
						
						//ok now we POST
						https.post('https://idp.wktransportservices.com/nidp/app/login?sid=0', { Ecom_User_ID: 'ABADMPROD', Ecom_Password: '' }, function(res){
							var result = '';
								res.on('data', function (chunk) {
									result += chunk;
								});
							res.on('end', function() {
								//can we be on TWA login ???
								console.log('So...post login BODY:' , result)
								
											
			if ( true ) {

						console.log('POST result chunk', result);
						
						//ok so now try to log in TWA:
						request('https://transwide.wktransportservices.com', function (error, response, body) {
						 // console.log('error:', error); // Print the error if one occurred
						  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
						 // console.log('response', response.headers)
						  console.log('3rd STEP body:', body); // Print the HTML for the Google homepage.
						});
			}
								
							})
						})
							
						
			
					});
					res.on('error', function (err) {
						console.log(err);
					})
				});	
			
		})			
	})
});

