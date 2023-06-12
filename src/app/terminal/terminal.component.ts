import { Component, OnInit } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

  prompt: Element = document.querySelector(".prompt")!;
  cursor: Element | null = document.querySelector('.typed-cursor');
  userInput: HTMLElement | null = document.getElementById('user-input');

  data = [
    { 
      action: 'type',
      strings: ["npm install -g portfolio^400"],
      output: '<span class="gray" style="color: gray">+emckevitt@0.10.2 installed</span><br>&nbsp;',
      postDelay: 1000
    },
    { 
        action: 'type',
        strings: ["cd tests^400"],
        output: '<br>',
        postDelay: 1000
    },
    // { 
    //     action: 'type',
    //     strings: ["that was easy!", ''],
    //     postDelay: 2000
    // },
  ];

  constructor() { }

  ngOnInit() {

    // Log initial dimensions of terminalwindow
    console.log("Initial width: " + $('section.terminal').width());
    console.log("Initial width of header: " + $('.terminal-window-header').width());

    this.setUpGreenBtn();

    this.displayOnTerminal(this.data, 0);
  }

  setUpGreenBtn() {
    // Add click listeners to buttons
    $('#green-btn').click(function() {
      console.log("Green button clicked");

      // If the terminal is maximized
      if ($('section.terminal').attr('maximized') === 'true') {
        console.log("Terminal is maximized, so minimize it");

        $('section.terminal').attr('maximized', 'false');

        // Shrink the terminal window 
        $('section.terminal').css('width', '600px');
        $('.terminal-window-header').css('width', '589px');

      } else {

        console.log("Terminal is minimized, so maximize it");

        $('section.terminal').attr('maximized', 'true');

        // Maximize the terminal window
        $('section.terminal').css('width', '800px');
        $('.terminal-window-header').css('width', '790px');
      }

      console.log("Attribute value: " + $('section.terminal').attr('maximized'));
    });
  }

  displayOnTerminal(data: any[], pos: number) {
    // Disable the input
    $('#user-input').prop('disabled', true);

    // script is the current object in the data array
    var script = data[pos];

    // If clear is set to true, clear the terminal
    if (script.clear === true) {
      $('.history').html('');
    }

    // Detect the action to perform
    switch(script.action) {
      case 'type':

        $('.typed-cursor').text('');

        // Type the message
        new Typed('.prompt', {
          strings: script.strings,
          typeSpeed: 50,
          backSpeed: 20,
          onComplete: () => {

            // Grab the history
            var historyElem = $('.history').html();
            
            var history = historyElem ? [historyElem] : [];

            console.log("Logging: " + '$ ' + $('.prompt').html());
            history.push('$ ' + $('.prompt').html());

            if (script.output) {
              history.push(script.output);
              $('.prompt').html('');
              $('.history').html(history.join('<br>'));
            }

            // scroll to bottom of screen\
            var screenHeight: number = $('section.terminal').height()!;
            $('section.terminal').scrollTop(screenHeight);

            // Run next script
            pos++;

            if(pos < data.length) {
              // Wait 1 sec and then display the next script
              setTimeout(() => {
                this.displayOnTerminal(data, pos);
              }, script.postDelay || 1000);
              
            } else {
              console.log("End of data array"); 
              
              // TODO: Let user type in the terminal

            }
          }
        })
      
        break;
    }
  }
}
