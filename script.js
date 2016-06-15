var keyCodes = [113,119,101,114,116,121,117,105,111,112,97,115,100,102,103,104,106,107,108,122,120,99,118,98,110,109]
var keys = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m"]


var soundsLinks = []
var sounds = []
var wrap = $('.wrapper')
ready(function(){
  getSounds(function(){
    soundsLinks.forEach(function(el, i){
      var s = new Audio(el)
      sounds.push(s)

      var btn = $('<button/>').text(el.replace('/sounds/','')).on('click', function(event){

        event.preventDefault()
        s.pause()
        s.currentTime = 0
        s.play()
      })
      wrap.append(btn)
    })
    paintTheRainbow('button')
    addKeyListeners('button')
  })
})

function addKeyListeners(selector){
  var els = document.querySelectorAll(selector)
  els = Array.prototype.slice.call(els)
  //add click events
  els.forEach(function(el){
    el.addEventListener('click', function(event){
      this.focus()
      console.log(this, event)
    })
  })


  //add key listeners
  keyCodes = keyCodes.slice(0, els.length)
  document.onkeypress = function(event){
    var index = keyCodes.indexOf(event.keyCode)
    if( event.keyCode == 32){
      sounds.forEach(function(sound){
        sound.pause()
        sound.currentTime = 0
      })
    }
    if( index > -1 ){
      console.log(index)
      fireEvent( els[index],'click' )
    }
  }
}

function paintTheRainbow(selector){
  var els = document.querySelectorAll(selector)
  els = Array.prototype.slice.call(els)
  var degreeIncrement = 360 / els.length
  var hue = degreeIncrement
  els.forEach(function(el){
    el.style['background-color'] = 'hsl('+hue+', 100%, 50%)'
    hue+=degreeIncrement
  })
}

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function fireEvent(node, eventName) {
   var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9){
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }
    var event;
    if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.

        switch (eventName) {
            // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "click":
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw Error("fireEvent: Couldn't find an event class for event '" + eventName + "'.");
                break;
        }
        event = doc.createEvent(eventClass);

        var bubbles = eventName == "change"
        // All events created as bubbling and cancelable.
        event.initEvent(eventName, bubbles, true);

        // allow detection of synthetic events
        event.synthetic = true;
        node.dispatchEvent(event, true);
    } else  if (node.fireEvent) {
        // IE-old school style
        event = doc.createEventObject();
        // allow detection of synthetic events
        event.synthetic = true;
        node.fireEvent("on" + eventName, event);
    }
}

function getSounds(cb){
  $.ajax({
  url: "sounds/",
  success: function(data){
     $(data).find("a:contains(.mp3)").each(function(){
       soundsLinks.push($(this).attr('href'))
     });
     cb()
    }
  });
}