var expect = require('expect');
var {generateMessage, generateLocationMessage} = require("./message");

describe('generateMessage', () => {
  it("should generate correct message object", () => {
    var from = "user1";
    var text = "Hello, this is user1";
    var message = generateMessage(from, text);
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', ()=> {
  it('should generate correct location object', () => {
    var from = 'Deb';
    var latitude = 22.396428;
    var longitude = 114.10949699999999;
    var url = 'https://www.google.com/maps?q=22.396428,114.10949699999999';
    var message = generateLocationMessage(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, url});
  });
});


//https://www.google.com/maps?q=22.396428,114.10949699999999