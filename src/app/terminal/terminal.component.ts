import { Component, OnInit } from '@angular/core';
import Typed from 'typed.js';


//// Note: Maybe headline can be Full-Stack <Developer/>,
////                             named Eric McKevitt.

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
    // { 
    //   action: 'type',
    //   strings: ["npm install -g portfolio^400"],
    //   output: '<span class="gray" style="color: gray">+emckevitt@0.10.2 installed</span><br>&nbsp;',
    //   postDelay: 1000
    // },
    { 
      action: 'type',
      strings: ["npm install -g portfolio^400"],
      output: '<span class="gray" style="color: gray">+portfolio@0.1.2 installed</span><br>&nbsp;',
      postDelay: 1000
    },
    { 
        action: 'type',
        strings: ['echo "go ahead. type a command."^5',
          'echo "go ahead. type a command. it actually works!"^1',
          'echo "go ahead. type a command."'],
        output: '<span class="gray" style="color: gray">go ahead. type a command.</span><br>&nbsp;',
        postDelay: 1000,
        typeSpeed: 30
    },
    { 
      action: 'type',
      strings: ['echo \'Type \"help\" to get started\'^400'],
      // output: '<span class="gray" style="color: gray">Type</span> <span class="magic">"help"</span><span> to get started</span><br>&nbsp;',
      output: '<span class="gray" style="color: gray">Type</span> <span style="color: rgb(244, 143, 177) !important">"help"</span><span style="color: gray;"> to get started</span><br>&nbsp;',
      postDelay: 1000,
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
    $('#user-input').css('opacity', '0');

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
          typeSpeed: script.typeSpeed ?? 50,
          backSpeed: 20,
          smartBackspace: true,
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
              enterUserInputMode();
            }
          }
        })
      
        break;
    }
  }
}

function enterUserInputMode() {
  console.log("Entering user input mode");

  // Enable the input
  $('#user-input').prop('disabled', false);
  $('#user-input').css('opacity', '1');

  let input = document.querySelector('#user-input')! as HTMLInputElement;
  let cursor = document.querySelector('.typed-cursor')! as HTMLElement;

  function adjustInputWidth() {
    // const input = document.querySelector('#user-input') as HTMLInputElement;
    input.style.width = input.value.length > 0 ? `${input.value.length}ch` : '0px';

    // Increase width of input by 1px
    input.style.width = `${input.offsetWidth + 1}px`;
  }

  input.addEventListener('input', (event) => {
    adjustInputWidth();
  });

  $('#user-input').focus();

  // Hide the cursor
  $('.typed-cursor').css('opacity', '0');

  // Set the width of the input to 0px
  $('#user-input').css('width', '0px');

  // Add a click listener to terminal window
  $('section.terminal').click(function() {
    // Shift focus to the input with id 'user-input'
    $('#user-input').focus();
  });

  // Add an event listener to the input for any keypress
  $('#user-input').keypress(function(e) {
    // console.log("Key pressed: " + e.which);

    // If ENTER is pressed
    if (e.which == 13) {
        console.log("ENTER pressed");

        // Get the value of the input
        submitCommand($('#user-input').val() as string);
    }
  });
}

function submitCommand(command: string) {
  console.log("Running command: " + command);

  // If $(.history).html() ends in two <br> tags, remove one of them.
  if ($('.history').html()!.endsWith('<br><br>')) {
    $('.history').html($('.history').html()!.slice(0, -4));
  }

  // Grab the history
  var historyElem = $('.history').html();          
  var history = historyElem ? [historyElem] : [];

  // Logging the command
  console.log("Logging: " + '$ ' + command);
  history.push('$ ' + command);

  // Clear the prompt
  $('.prompt').html('');

  if (command == "ls") {
    // Handle output
    var output = '<span style="color: gray">Home<br>About<br>Professional Experience<br>Projects<br>Skills<br>Contact</span>';
    history.push(output);
    history.push("<br>");

  } else if (command == "clear") {
    history = [];

  } else if (command == "help" || command == '\"help\"') {
    // var output = '<span style="color: gray">Glad you asked.<br><br>&#215; You can type "ls" to see the available page sections.<br>&#215; Typing "cd" followed by a section name will take you there!<br>&#215; If the terminal gets crowded, just type "clear".<br>&#215; For a list of all commands, type "commands".<br><br>Or you can just navigate the website manually, I guess. See you around!</span>';
    var output = '<span style="color: gray">Glad you asked.<br><br>&#215; You can type </span><span style="color: rgb(244, 143, 177) !important;">"ls"</span><span style="color: gray"> to see the available page sections.<br>&#215; Typing </span><span style="color: rgb(244, 143, 177) !important;">"cd"</span><span style="color: gray;"> followed by a section name will take you there!<br>&#215; If the terminal gets crowded, just type </span><span style="color: rgb(244, 143, 177) !important;">"clear"</span><span style="color: gray;">.<br>&#215; For a list of all commands, type </span><span style="color: rgb(244, 143, 177) !important;">"commands"</span><span style="color: gray">.<br><br>Or you can just navigate the website manually, I guess. See you around!</span>';
    history.push(output);
    history.push("<br>");
  
  } else {
    // Handle output
    let first_word = command.split(' ')[0];
    var output = `<span style="color: rgba(214, 13, 13, 0.722);">Command not found: ${first_word}</span>`;
    history.push(output);
    history.push("<br>");
    
  }

  // Update the history
  $('.history').html(history.join('<br>'));

  // Scroll to the bottom of the screen
  $('section.terminal').scrollTop($('section.terminal').height() as number);

  // Clear the input
  $('#user-input').val('');

  // Shift focus to the input with id 'user-input'
  $('#user-input').focus();

  // Update width of input
  $('#user-input').css('width', '0px');
}