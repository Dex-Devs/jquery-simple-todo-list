$(document).ready(function (){
  var tasksAdded = [];

  // ADDING TASKS BY CLICKING A BUTTON
  $('#add-btn').on('click', function() {

    var task = $('#text').val().toUpperCase();
    
    if(task.length <= 0) {

      Swal.fire({
        text: 'Task already added.',
        title: 'Oops!',
        html: '<span>You didn\'t enter something.</span>',
        icon: 'error',
        confirmButtonText: 'Okay',
        iconColor: '#222233',
        allowOutsideClick: true,
      });

    }else if(!(tasksAdded.includes(task))) {

      $('#container .no-task-message').css('display', 'none');
      tasksAdded.push(task);
      
      var container = $('<div>').addClass('tasks-sub-cont').attr('id', 'container__task');
      var paragraph = $('<div>').addClass('p-container');

      paragraph.append(`<p class="task-text">${task}</p>`)

      var iconPlacer= $('<div>').attr('id','placer').addClass('icon-placer')
      
      var edit = $('<div>').addClass('icon-container').attr('id','edit');
      
      edit.append(`<i class="fa fa-edit icon" style="font-size: 1.8rem;" id="edit-btn" title="Edit task."></i>`);
       
      var del = $('<div>').addClass('icon-container').attr('id','delete');
      
      del.append(`<i class="fa fa-trash icon" style="font-size: 1.8rem;" id="delete-btn" title="Delete task."></i>`);
      
      container.append(paragraph).append(iconPlacer.append(edit).append(del));

      $('#container').append(container.addClass('animate-class'));

      /* $('#container__task').animate({"left": "0"}, 1000); */
      
      $('#container').children(':last').animate({"left": "0"}, 1000);

      // clear field on submit
      $('#text').val("");

      }else {

        alreadyAddedModal();
        $('#text').val("");

      }

      // REMOVING TASK FROM THE LIST


      $('div#delete').on('click','i#delete-btn', function(e) {

        e.preventDefault();

        Swal.fire({
          title: 'Delete task?',
          text: 'This task will be removed permanently.',
          showCancelButton: true
        }).then(result=> {

          if(result.isConfirmed) {

            Swal.fire({
              title: '<span style="display:inline-block; font-size:1.5rem">Task Deleted!</span>',
              icon: "success",
              iconColor: '#222233',
              confirmButtonText: 'Continue'
            }).then(res => {

              // excute after confirming
              if(res) {
                const removeTimer = new Promise( (resolve) => {
                  setTimeout( () => {
                    $(this).parentsUntil('#container').remove();
                  }, 950)
                })

                  var textFromCont = $(this).parentsUntil('#container')[$(this).parentsUntil('#container').length-1].children[0].innerText;
    
                  // remove task name for future reuse
                  tasksAdded.splice(tasksAdded.indexOf(textFromCont), 1);
    
                  $(this).parentsUntil('#container').animate({opacity: 0.4,top:-10},900);
    
                  // display message when task list is empty
                  if($('#container').children().length < 3) {
                    $('.no-task-message').css('display', 'block');
                  }
              }
            })
          }
        })

      })

      // EDITING TASKS
      $('div#edit').on('click', 'i#edit-btn', async function(e) {

        e.preventDefault();

        var currentText = $(this).parentsUntil('#container')[$(this).parentsUntil('#container').length-1].children[0].innerText;
        
        var {value: edited} = await Swal.fire({
          title: 'Edit task',
          input: 'text',
          inputLabel: 'Your IP address',
          inputPlaceholder: currentText,  
          showCancelButton: true,
          allowEnterKey: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!'
            }
          }
        }).then(object => object).catch(error => {console.log(error)});
        if(edited) {
          edited = edited.toUpperCase();

          // if word enter is in the collection .. cancel edit action
          if(tasksAdded.includes(edited) === true){
            alreadyAddedModal();

          }else {

            // replace task name
            $($(this).parentsUntil('#container')[$(this).parentsUntil('#container').length-1].children[0].children[0])[0].innerText = edited;

            // remove replaced task -- add task that replaced the previous
            prevIndex = tasksAdded.indexOf(currentText);

            tasksAdded.splice(prevIndex, 1, edited);

            Swal.fire({
              title: '<span style="display:inline-block; font-size:1.5rem">Task Edited!</span>',
              icon: "success",
              iconColor: '#222233',
              confirmButtonText: 'Continue'
            });
          }
        
        }
      })

  })

})

  // FUNCTION FOR SHOWING POP-UP MODAL FOR REPETITIVE TASK/S
  function alreadyAddedModal() {
    Swal.fire({
      html: '<span>Task already in your list.</span>',
      icon: 'info',
      confirmButtonText: 'Okay',
      iconColor: '#222233',
      allowOutsideClick: true,
    })
  }