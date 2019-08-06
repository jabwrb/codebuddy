$(document).ready(function() {
    $('#global_loader').attr('style', 'display: none')
    $('#settings-modal').modal({
      closable: false,
      transition: 'fade up',
      onApprove : function() {
        //$('.ui.form').submit();
        return false;
      },
    })
    $('#assignment-modal').modal({
      closable: false,
      transition: 'fade up',
      onApprove : function() {
        //$('.ui.form').submit();
        return false;
      },
    })
    $('#alert-modal').modal({
      closable: false,
      transition: 'fade up',
    })
    $('.newProject').click(function () {
      $('#newProject-modal').modal('show');
    });
    $('.first_container_menu').click(function () {
      showFirstContainer()
    });
    $('.second_container_menu').click(function () {
      showSecondContainer()
    });
    $('.third_container_menu').click(function () {
      showThirdContainer()
    });
    $('.ui.form.updateSection').form({
      fields: {
        course_name: {
          identifier: 'course_name',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your course name'
            }
          ]
        },
        section: {
          identifier: 'section',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your section'
            },
            {
              type : 'regExp[[0-9]]',
              prompt : 'This section is not valid!'
            }
          ]
        },
        room: {
          identifier: 'room',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your room'
            }
          ]
        }
      },
      onSuccess : function() {
        $('#newClassroom-modal').modal('hide');
      },
    })
    $('.newAssignment').click(function (){
      $('#assignment-modal').modal('show')
    })
    $('.ui.form.createAssignment').form({
      fields: {
        title: {
          identifier: 'title',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your title'
            }
          ]
        },
        week: {
          identifier: 'week',
          rules: [
            {
              type   : 'integer[1...100]',
              prompt : 'Please enter an integer value'
            }
          ]
        },
        description: {
          identifier: 'description',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your description'
            }
          ]
        },
        input_specification: {
          identifier: 'input_specification',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your input specification'
            }
          ]
        },
        output_specification: {
          identifier: 'output_specification',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your output specification'
            }
          ]
        },
        sample_input: {
          identifier: 'sample_input',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your sample input'
            }
          ]
        },
        sample_output: {
          identifier: 'sample_output',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your sample output'
            }
          ]
        }
      },
      onSuccess : function() {
        $('#assignment-modal').modal('hide');
      },
    })

    pairingOrViewingisHided('pair')
    // $('#resetPair-button').click(function(){
    //   parameters = {partner_id: 'NULL', section_id: $('#section_id').attr('value')}
    //   $.ajax({
    //     url: 'classroom/resetPair',
    //     type: 'put',
    //     data: parameters,
    //     success: function (data) {
    //       const status = data.status
    //       if(status == 'Update completed.') {
    //         alert('Reset pairing completed!')
    //       } else if(status == 'Update failed.') {
    //         alert(status)
    //       }
    //     }
    //   })
    // })
    $('#student_list_modal').modal({
      closable: false,
    });
    $('#partner_selection_modal').modal({
      closable: false,
    });
    $('#pairingSettingsModal').modal({
      closable: false,
    })
    $('#back-to-student-list-modal').click(function () {
      $('#student_list_modal').modal('show');
    })
    $('#cancelAutoPairingBtn').click(function (){
      $('#student_list_modal').modal('show');
    })
    $('.menu .item').tab();
})

function showFirstContainer() {
  $('#first_container').show();
  $('#second_container').hide();
  $('#third_container').hide();
}
function showSecondContainer(){
  $('#first_container').hide();
  $('#second_container').show();
  $('#third_container').hide();
}
function showThirdContainer(){
  $('#first_container').hide();
  $('#second_container').hide();
  $('#third_container').show();
}

function setClassroomDetail(day, startTime, endTime) {
  $('.settings-menu').click(function () {
    let startTimeHh = startTime[0] + startTime[1]
    let startTimeMm = startTime[3] + startTime[4]
    let startTimeAp = startTime[5] + startTime[6]
    let endTimeHh = endTime[0] + endTime[1]
    let endTimeMm = endTime[3] + endTime[4]
    let endTimeAp = endTime[5] + endTime[6]
    $('.day option[value=\'' + day + '\']').attr('selected', 'selected');
    $('.timeStartHh option[value=' + startTimeHh + ']').attr('selected', 'selected');
    $('.timeStartMm option[value=' + startTimeMm + ']').attr('selected', 'selected');
    $('.timeStartAp option[value=' + startTimeAp + ']').attr('selected', 'selected');
    $('.timeEndHh option[value=' + endTimeHh + ']').attr('selected', 'selected');
    $('.timeEndMm option[value=' + endTimeMm + ']').attr('selected', 'selected');
    $('.timeEndAp option[value=' + endTimeAp + ']').attr('selected', 'selected');
    $('.ui.form').trigger('reset');
    $('.ui.form .field.error').removeClass('error');
    $('.ui.form.error').removeClass('error');
    $('#settings-modal').modal('show');
  });
}

function on_click_ui_purpose_tab (index, purpose, student_id, pairing_session_id, username, avg_score, section_id, partner_keys, pairing_objective) {
  $('.ui-purpose').removeClass('teal inverted')
  $('#ui-purpose-'+index).addClass('teal inverted')
  let parameters = { student_id: student_id, pairing_session_id: pairing_session_id, username: username, avg_score: avg_score, section_id: section_id, purpose: purpose, partner_keys: JSON.stringify(partner_keys), pairing_objective: JSON.stringify(pairing_objective)};
  $.get( '/classroom/searchStudentByPurpose',parameters, function(data) {
      $(".user-purpose-list").empty();
      let student_id = data.student_id
      let pairing_session_id = data.pairing_session_id
      let students = data.students
      let purpose = data.purpose
      let section_id = data.section_id
      let partner_keys = JSON.parse(data.partner_keys)
      let pairing_objective = JSON.parse(data.pairing_objective)
      // let pairing_objective = JSON.parse($('#pairing_objective').attr('value'))
      if (students.length > 0) {
          students.forEach(function(student) {
            if(pairing_objective[student.enrollment_id] == -1) {
              $(".user-purpose-list").append("<div class='item'><div class='right floated content'><div class='ui button add-partner-button' onclick='onClickAddPartnerButton("+student_id+","+student.enrollment_id+",\""+purpose+"\",\""+section_id+"\","+pairing_session_id+", "+JSON.stringify(partner_keys)+", "+JSON.stringify(pairing_objective)+",2)'>Add</div></div><img class='ui avatar image' src='"+ student.img +"'><div class='content'><div class='header'>"+student.first_name+" "+student.last_name+"</div><div class='description'><div class='ui circular labels'><a class='ui teal label'>score "+parseFloat(student.avg_score).toFixed(2)+"</a><a class='ui green label'> Available </a></div><div style='font-size: 12px;'>total active time: "+pad(parseInt(student.total_time/3600))+":"+pad(parseInt((student.total_time-(parseInt(student.total_time/3600)*3600))/60))+":"+pad(parseInt(student.total_time%60))+"</div></div></div></div>");
            } else {
              $(".user-purpose-list").append("<div class='item'><div class='right floated content'><div class='ui button add-partner-button' onclick='onClickAddPartnerButton("+student_id+","+student.enrollment_id+",\""+purpose+"\",\""+section_id+"\","+pairing_session_id+", "+JSON.stringify(partner_keys)+", "+JSON.stringify(pairing_objective)+",2)'>Add</div></div><img class='ui avatar image' src='"+ student.img +"'><div class='content'><div class='header'>"+student.first_name+" "+student.last_name+"</div><div class='description'><div class='ui circular labels'><a class='ui teal label'>score "+parseFloat(student.avg_score).toFixed(2)+"</a><a class='ui red label'> Paired </a></div><div style='font-size: 12px;'>total active time: "+pad(parseInt(student.total_time/3600))+":"+pad(parseInt((student.total_time-(parseInt(student.total_time/3600)*3600))/60))+":"+pad(parseInt(student.total_time%60))+"</div></div></div></div>");
            }
          }, this);
      } else {
          $(".user-purpose-list").append("<li class='ui item'>No results</li>")
      }
  })
}

function on_click_confirm_pairing_button(parameters) {
  $('#confirm-button').attr('onclick', 'on_click_confirm_button('+JSON.stringify(parameters)+')')
  $('#confirm-header').text('Create new pairing session')
  $('#confirm-message').text('Are you sure you want to create new pairing session?')
  $('#confirm-message').attr('value', 'Are you sure you want to create new pairing session?')
  $('#confirm-modal').modal('show')
}

function on_click_cancel_pairing_button() {
  const message = $('#confirm-message').attr('value');
  if(message == 'Are you sure you want to cancel pairing?'){
    $('#confirm-button').attr('onclick', 'on_click_confirm_button({})')
    $('#confirm-modal').modal('show');
  } else {
    $('#alphabetical_filter').attr('class', 'ui button')
    $('#alphabetical_filter').attr('value', 'A-Z')
    $('#alphabetical_filter').text('A-Z')

    $('#avg_score_filter').attr('class', 'ui button')
    $('#avg_score_filter').attr('value', '1-100')
    $('#avg_score_filter').text('1-100')

    $('#active_filter').attr('value', '')
    $('#confirm-pairing').attr('value', 'create')

    $('#autoPairing').hide()
  }
}

function on_click_cancel_button() {
  const message = $('#confirm-message').attr('value');
  if(message == 'Are you sure you want to cancel pairing?'){
    $('#student_list_modal').modal('show');
  } else if (message == 'Are you sure you want to create new pairing session?') {
    $('#student_list_modal').modal('show');
  }
}

function on_click_confirm_button(parameters){
  const message = $('#confirm-message').attr('value');

  if (message == 'Are you sure you want to create new pairing session?') {
    const session_status = $('#newPairingSession').attr('value')
    if(session_status <= 0 && $('#confirm-pairing').attr('value') == 'create'){
      $('#global_loader').attr({
        'style': 'display: block; position: fixed;'
      })
      $.post('/classroom/createPairingRecord', parameters, function(data){
        const res_status = data.res_status
        const pairing_sessions = JSON.parse(data.pairing_sessions)
        const section_id = data.section_id
        const data_for_weeks_dropdown_function = JSON.parse(data.data_for_weeks_dropdown_function)
        if(res_status == 'There is no student in the classroom!'){
          alert(res_status)
        } else if(res_status == 'Please pair all students!'){
          alert(res_status)
          $('#student_list_modal').modal('show');
        } else if(res_status == 'Update completed.'){
          $('#no_session').empty()
          $('#menu_week').empty()
          create_weeks_dropdown('#menu_week', pairing_sessions[0].pairing_session_id, data_for_weeks_dropdown_function)
          $('#weeks').dropdown();
          on_click_weeks_dropdown('-1week', JSON.parse(data_for_weeks_dropdown_function.assignments), data_for_weeks_dropdown_function.username, data_for_weeks_dropdown_function.img, pairing_sessions[0].pairing_session_id, 0)
          set_item_pagination_in_third_container(pairing_sessions, section_id, "teacher")
          on_click_page_number_in_third_container(1)
          $('#change_pair').attr('onclick', 'on_click_change_pair('+pairing_sessions[0].pairing_session_id+', \"'+section_id+'\")')
          $('.ui.pointing.dropdown').dropdown();
          $('#newPairingSession').attr('onclick', 'onClickCreateSession('+pairing_sessions[0].pairing_session_id+', \"'+section_id+'\", '+pairing_sessions[0].status+')')
          $('#newPairingSession').attr('value', 1)
        } else {
          alert(status)
        }
        $('#global_loader').attr({
          'style': 'display: none; position: fixed;'
        })
      })
    } else if (session_status == 1 && $('#confirm-pairing').attr('value') == 'change'){
      $('#global_loader').attr({
        'style': 'display: block; position: fixed;'
      })
      $('#autoPairing').hide()
      parameters = {partner_keys: JSON.parse(parameters.partner_keys), cloning_partner_keys: JSON.parse($('#cloning_partner_keys').attr('value')), pairing_objective: JSON.parse(parameters.pairing_objective), cloning_pairing_objective: JSON.parse($('#cloning_pairing_objective').attr('value')), pairing_session_id: parameters.pairing_session_id, section_id: parameters.section_id}
      $.ajax({
        url: '/classroom/updatePairing',
        type: 'put',
        data: parameters,
        success: function(data){
          var status = data.status
          $('#loader').attr('style', 'display: none')
          if(status == 'Update pairing successfully') {
            $('#partner_keys').attr('value', {})
            $('#cloning_partner_keys').attr('value', {})
            $('#pairing_objective').attr('value', {})
            pairingOrViewingisHided('view')
            $('#confirm-pairing').attr('value', 'create')
            alert(status)
          } else if(status == 'Please pair all students!'){
            alert(status)
            $('#confirm-header').text('Student pairing')
            $('#confirm-message').text('Are you sure you want to cancel pairing?')
            $('#confirm-message').attr('value', 'Are you sure you want to cancel pairing?')
            $('#student_list_modal').modal('show');
          } else {
            $('#confirm-pairing').attr('value', 'create')
            alert(status)
          }
          $('#global_loader').attr({
            'style': 'display: none; position: fixed;'
          })
        }
      })
    } else {
      $('#alert-header').text('Pairing session')
      $('#alert-message').text('You can\'t create session!')
      $('#alert-modal').modal('show')
    }
   } else if(message == 'Are you sure you want to cancel pairing?'){
    $('#alphabetical_filter').attr('class', 'ui button')
    $('#alphabetical_filter').attr('value', 'A-Z')
    $('#alphabetical_filter').text('A-Z')

    $('#avg_score_filter').attr('class', 'ui button')
    $('#avg_score_filter').attr('value', '1-100')
    $('#avg_score_filter').text('1-100')

    $('#active_filter').attr('value', '')
    $('#confirm-pairing').attr('value', 'create')

    $('#autoPairing').hide()

  } else if(message == 'Are you sure you want to complete this pairing session?'){
    $('#global_loader').attr({
      'style': 'display: block; position: fixed;'
    })
    $.ajax({
      url: '/classroom/updatePairingSession',
      type: 'put',
      data: parameters,
      success: function(data){
        let status = data.status
        let pairing_session = JSON.parse(data.pairing_sessions)
        let section_id = data.section_id
        if(status == 'Update completed.') {
          console.log('pairing_session, ', pairing_session)
          set_item_pagination_in_third_container(pairing_session, section_id, "teacher")
          on_click_page_number_in_third_container(1)
          $('#newPairingSession').attr('value', 0);
          $('#confirm-pairing').attr('value', 'create')
        } else {
          alert(status)
        }
        $('#global_loader').attr({
          'style': 'display: none; position: fixed;'
        })
      }
    })
  } else if(message == 'Are you sure you want to assign these assignments to all student pairs?'){
    $('#global_loader').attr({
      'style': 'display: block; position: fixed;'
    })
    $.post('/classroom/assignAssignment', parameters, function (data){
      var res_status = data.res_status
      if(res_status == 'Please pair all students before assign the assignment!'){
        alert(res_status)
      } else if(res_status == 'You already assigned these assignments!') {
        alert(res_status)
      } else if(res_status == 'Successfully assigned this assignment!') {
        alert(res_status)
      } else if(res_status == 'Completed test!') {
        alert(res_status)
      } else {
        alert(res_status)
      }
      $('#global_loader').attr({
        'style': 'display: none; position: fixed;'
      })
    })
  } else if (message == 'Are you sure you want to remove the student from this classroom?'){
    $('#global_loader').attr({
      'style': 'display: block; position: fixed;'
    })
    $.ajax({
      url: '/api/removeStudent',
      type: 'delete',
      data: parameters,
      success: function (res) {
        if(res.status == 'Remove the student from the classroom complete.') {
          $('#' + res.enrollment_id).remove()
          alert(res.status)
        } else {
          alert(res.status)
        }
        $('#global_loader').attr({
          'style': 'display: none; position: fixed;'
        })
      }
    })
  } else if (message == 'Are you sure you want to delete these assignment?') {
    $('#global_loader').attr({
      'style': 'display: block; position: fixed;'
    })
    $.ajax({
      url: '/api/deleteAssignment',
      type: 'delete',
      data: parameters,
      success: function (res) {
        let status = res.data_set.common.status
        let assignments = JSON.parse(res.data_set.json.assignments)
        let username = res.data_set.common.username
        let img = res.data_set.common.img
        let pairing_session_id = res.data_set.common.pairing_session_id
        let opt = 0
        let weeks = res.data_set.common.weeks
        let data_for_weeks_dropdown_function = {assignments: JSON.stringify(assignments), username: username, img: img, weeks: weeks}
        if(status == 'Delete all of these assignment successfully.') {
          $('#menu_week').empty()
          create_weeks_dropdown('#menu_week', pairing_session_id, data_for_weeks_dropdown_function)
          $('#weeks').dropdown();
          on_click_weeks_dropdown('-1week', assignments, username, img, pairing_session_id, opt)
          $('#clear_checkbox').attr('onclick', 'checkbox_event('+JSON.stringify(assignments)+', \'-1week\', 0)')
          $('#check_all_of_box').attr('onclick', 'checkbox_event('+JSON.stringify(assignments)+', \'-1week\', 1)')
          alert(status)
        } else {
          alert(status)
        }
        $('#global_loader').attr({
          'style': 'display: none; position: fixed;'
        })
      }
    })
  } else if (message == 'Are you sure you want to disable assignments on this week?'){
    $('#global_loader').attr({
      'style': 'display: block; position: fixed;'
    })
    $.ajax({
      url: '/classroom/manageAssignment',
      type: 'put',
      data: parameters,
      success: function (res) {
        let status = res.status
        if(status == 'Disable assignments successfully.') {
          alert(status)
        } else {
          alert(status)
        }
        $('#global_loader').attr({
          'style': 'display: none; position: fixed;'
        })
      }
    })
  } else if (message == 'Are you sure you want to enable assignments on this week?') {
    $('#global_loader').attr({
      'style': 'display: block; position: fixed;'
    })
    $.ajax({
      url: '/classroom/manageAssignment',
      type: 'put',
      data: parameters,
      success: function (res) {
        let status = res.status
        if(status == 'Enable assignments successfully.') {
          alert(status)
        } else {
          alert(status)
        }
        $('#global_loader').attr({
          'style': 'display: none; position: fixed;'
        })
      }
    })
  } else if (message == 'Are you sure you want to start auto pairing?') {
    console.log('parameters, ', parameters)
    $.get('/classroom/startAutoPairingByPurpose', parameters, function (res) {
      alert(res.resStatus)
      $('#student_list_modal').modal('show')
    })
  }

  $('#confirm-message').attr('value', 'Something message.')
}

function searchStudent(id, student_id, section_id, pairing_session_id, username, partner_keys, pairing_objective){
  //console.log('section_id: ' + section_id)
  var parameters = { search: $(id).val(), student_id: student_id, section_id: section_id, pairing_session_id: pairing_session_id, username: username, partner_keys: JSON.stringify(partner_keys), pairing_objective: JSON.stringify(pairing_objective)};
  $.get( '/classroom/searchStudent', parameters, function(data) {
    const student_id = data.student_id
    const students = data.students
    const purpose = data.purpose
    const section_id = data.section_id
    const pairing_session_id = data.pairing_session_id
    const partner_keys = JSON.parse(data.partner_keys)
    const pairing_objective = JSON.parse(data.pairing_objective)
    $(".user-list").empty();
    if (students.length > 0) {
      students.forEach(function(student) {
        if(pairing_objective[student.enrollment_id] == -1) {
          $(".user-list").append("<div class='item'><div class='right floated content'><div class='ui button add-partner-button' onclick='onClickAddPartnerButton("+student_id+","+student.enrollment_id+",\""+purpose+"\",\""+section_id+"\","+pairing_session_id+", "+JSON.stringify(partner_keys)+", "+JSON.stringify(pairing_objective)+",2)'>Add</div></div><img class='ui avatar image' src='"+ student.img +"'><div class='content'><div class='header'>"+student.first_name+" "+student.last_name+"</div><div class='description'><div class='ui circular labels'><a class='ui teal label'>score "+parseFloat(student.avg_score).toFixed(2)+"</a><a class='ui green label'> Available </a></div><div style='font-size: 12px;'>total active time: "+pad(parseInt(student.total_time/3600))+":"+pad(parseInt((student.total_time-(parseInt(student.total_time/3600)*3600))/60))+":"+pad(parseInt(student.total_time%60))+"</div></div></div></div>");
        } else {
          $(".user-list").append("<div class='item'><div class='right floated content'><div class='ui button add-partner-button' onclick='onClickAddPartnerButton("+student_id+","+student.enrollment_id+",\""+purpose+"\",\""+section_id+"\","+pairing_session_id+", "+JSON.stringify(partner_keys)+", "+JSON.stringify(pairing_objective)+",2)'>Add</div></div><img class='ui avatar image' src='"+ student.img +"'><div class='content'><div class='header'>"+student.first_name+" "+student.last_name+"</div><div class='description'><div class='ui circular labels'><a class='ui teal label'>score "+parseFloat(student.avg_score).toFixed(2)+"</a><a class='ui red label'> Paired </a></div><div style='font-size: 12px;'>total active time: "+pad(parseInt(student.total_time/3600))+":"+pad(parseInt((student.total_time-(parseInt(student.total_time/3600)*3600))/60))+":"+pad(parseInt(student.total_time%60))+"</div></div></div></div>");
        }
      }, this);
    } else {
      $(".user-list").append("<li class='ui item'>No results</li>")
    }
  })
}

function onClickAddPartnerButton(first_param, second_param, third_param, section_id, pairing_session_id, partner_keys, pairing_objective, opt) {
  // console.log('partner_keys, ', JSON.parse($('#partner_keys').attr('value')), ', pairing_objective, ', JSON.parse($('#pairing_objective').attr('value')))
  switch (opt) {
    case 1:
      let enrollment_id = first_param
      let username = third_param
      let avg_score = second_param

      $('#ui-purpose-0').attr('onclick', 'on_click_ui_purpose_tab('+$('.ui-purpose').index($('#ui-purpose-0'))+', \"'+$('#ui-purpose-0').data('purpose')+'\", '+enrollment_id+', '+pairing_session_id+', \"'+username+'\", '+avg_score+', \"'+section_id+'\", '+JSON.stringify(partner_keys)+', '+JSON.stringify(pairing_objective)+')')
      $('#ui-purpose-1').attr('onclick', 'on_click_ui_purpose_tab('+$('.ui-purpose').index($('#ui-purpose-1'))+', \"'+$('#ui-purpose-1').data('purpose')+'\", '+enrollment_id+', '+pairing_session_id+', \"'+username+'\", '+avg_score+', \"'+section_id+'\", '+JSON.stringify(partner_keys)+', '+JSON.stringify(pairing_objective)+')')
      $('#ui-purpose-2').attr('onclick', 'on_click_ui_purpose_tab('+$('.ui-purpose').index($('#ui-purpose-2'))+', \"'+$('#ui-purpose-2').data('purpose')+'\", '+enrollment_id+', '+pairing_session_id+', \"'+username+'\", '+avg_score+', \"'+section_id+'\", '+JSON.stringify(partner_keys)+', '+JSON.stringify(pairing_objective)+')')
      $('#search-user-by-input').attr('onkeyup', 'searchStudent(\"#search-user-by-input\", '+enrollment_id+', \"'+section_id+'\", '+pairing_session_id+', \"'+username+'\", '+JSON.stringify(partner_keys)+', '+JSON.stringify(pairing_objective)+')')
      //make user list is empty on search user panel
      $(".user-list").empty();
      $(".user-list").append("<div class='li ui item'>Search result</div>")

      $('.student-score').text('Student score ' + parseFloat(avg_score).toFixed(2))
      $(".user-purpose-list").empty();
      $(".user-purpose-list").append("<li class='ui item'>Please select your purpose.</li>");
      $('#partner_selection_modal').modal('show')
      break;
    case 2:
      let student_id = first_param
      let partner_id = second_param
      let purpose = third_param

      let key;
      let addSamePartner = false

      // partner_id is value in partner_keys
      // ex. partner_keys = {0: 1, 2: 3} expected {0: -1, 2: 1, 3: -1}
      // pair student_id = 2 with partner_id = 1 will make undefined
      if (partner_keys[partner_id] === undefined) {
        key = Object.keys(partner_keys).find(key => partner_keys[key] === partner_id)
        if(key == student_id) {
          addSamePartner = true
        }
      } else {
        key = partner_keys[partner_id]
      }

      if(partner_keys[student_id] < 0 && pairing_objective[partner_id] != -1) {
        partner_keys[key] = -1
        pairing_objective[key] = -1
      } else if(partner_keys[student_id] > 0 && !addSamePartner) {
          if(pairing_objective[partner_id] == -1){
            partner_keys[partner_keys[student_id]] = -1
            pairing_objective[partner_keys[student_id]] = -1
          } else {
            partner_keys[key] = -1
            pairing_objective[key] = -1

            partner_keys[partner_keys[student_id]] = -1
            pairing_objective[partner_keys[student_id]] = -1
        }
      }
      //add new partner to student
      partner_keys[student_id] = partner_id
      delete partner_keys[partner_id]

      pairing_objective[student_id] = purpose
      pairing_objective[partner_id] = purpose
      $('#confirm-header').text('Student pairing')
      $('#confirm-message').text('Are you sure you want to cancel pairing?')
      $('#confirm-message').attr('value', 'Are you sure you want to cancel pairing?')
      $('#cancel-pairing').attr('onclick', 'on_click_cancel_pairing_button()')
      showStudentList('pair', partner_keys, pairing_objective, pairing_session_id, section_id)
      break;
  }
}

function showStudentList(command, partner_keys, pairing_objective, pairing_session_id, section_id){
  let parameter = { partner_keys: JSON.stringify(partner_keys), pairing_objective:  JSON.stringify(pairing_objective), section_id: section_id, pairing_session_id: pairing_session_id, command: command};
  $.get('/classroom/getStudentsFromSection',parameter, function(data) {
    var count = 0
    const student_objects = data.student_objects
    const partner_keys = data.partner_keys
    const pairing_objective = data.pairing_objective
    const pairing_session_status = data.pairing_session_status
    const command = data.command
    let addPartnerButton = "";

    var completed_filter = false
    var hasElementMoving = false

    if(command == 'pair') {
      if(pairing_session_status == 1) {
        $('#change_pair').show()
      } else {
        $('#change_pair').hide()
        $('#autoPairing').show()
      }

    } else if(command == 'view') {
      if(pairing_session_status == 1) {
        $('#change_pair').show()
      } else {
        $('#change_pair').hide()
      }
    }

    $('.student-container').empty();
    for (key in partner_keys) {
      if(partner_keys[key] < 0) {

        $('.student-container').append("<li id='"+key+"' class='ui segment'><div class='ui two column very relaxed grid'><div class='column'><div class='ui items'><div class='item'><img class='ui avatar image' src='"+student_objects[key].img+"'></img><div class='content'><div class='header'>"+student_objects[key].first_name+" "+student_objects[key].last_name+"</div><div class='description'><div class='ui circular labels' style='margin-top:2.5px;'><a class='ui teal label'>score "+parseFloat(student_objects[key].avg_score).toFixed(2)+"</a></div><div style='font-size: 12px;'>total active time: "+pad(parseInt(student_objects[key].total_time/3600))+":"+pad(parseInt((student_objects[key].total_time-(parseInt(student_objects[key].total_time/3600)*3600))/60))+":"+pad(parseInt(student_objects[key].total_time%60))+"</div></div></div></div></div></div><div class='column'><div class='ui items'><div class='item'><img class='ui avatar image' src='images/user_img_0.jpg' style='visibility:hidden;'></img><div class='content'><div class='right floated content'><div class='ui button add-user-button' style='margin-top: 22px;' onclick='onClickAddPartnerButton("+ student_objects[key].enrollment_id + "," + student_objects[key].avg_score + ",\"" + student_objects[key].username.toString() + "\",\""+section_id+"\","+pairing_session_id+", "+JSON.stringify(partner_keys)+", "+JSON.stringify(pairing_objective)+", 1)'>Add</div></div><div class='description'><div style='font-size: 12px; visibility:hidden;'>total active time: "+pad(parseInt(0/3600))+":"+pad(parseInt((0-(parseInt(0/3600)*3600))/60))+":"+pad(parseInt(0%60))+"</div><font color='#5D5D5D'> Empty </font><div class='ui circular labels' style='margin-top:2.5px; visibility:hidden;'><a class='ui teal label'> score "+parseFloat(0).toFixed(2)+"</a></div></div></div></div></div></div></div><div class='ui vertical divider'> - </div></li>")

      } else {

        if(command == 'pair') {
          addPartnerButton = "<div class='ui button add-user-button' style='margin-top: 22px;' onclick='onClickAddPartnerButton("+ student_objects[key].enrollment_id + "," + student_objects[key].avg_score + ",\"" + student_objects[key].username.toString() + "\",\""+section_id+"\","+pairing_session_id+", "+JSON.stringify(partner_keys)+", "+JSON.stringify(pairing_objective)+",1)'>Add</div>"
        }
        var pairing_objective_str = pairing_objective[key];
        if(pairing_objective_str == 'quality' || pairing_objective_str == 'expertWithExpert') {
          pairing_objective_str = "<i class='line chart icon'></i>"
        } else if(pairing_objective_str == 'experience' || pairing_objective_str == 'noviceWithNovice') {
          pairing_objective_str = "<i class='line idea icon'></i>"
        } else if(pairing_objective_str == 'train' || pairing_objective_str == 'expertWithNovice') {
          pairing_objective_str = "<i class='line student icon'></i>"
        } else {
          pairing_objective_str = "<i class='search icon'></i>"
        }

        $('.student-container').append("<li id='"+key+"' class='ui segment'><div class='ui two column very relaxed grid'><div class='column'><div class='ui items'><div class='item'><img class='ui avatar image' src='"+student_objects[key].img+"'></img><div class='content'><div class='header'>"+student_objects[key].first_name+" "+student_objects[key].last_name+"</div><div class='description'><div class='ui circular labels' style='margin-top:2.5px;'><a class='ui teal label'>score "+parseFloat(student_objects[key].avg_score).toFixed(2)+"</a></div><div style='font-size: 12px;'>total active time: "+pad(parseInt(student_objects[key].total_time/3600))+":"+pad(parseInt((student_objects[key].total_time-(parseInt(student_objects[key].total_time/3600)*3600))/60))+":"+pad(parseInt(student_objects[key].total_time%60))+"</div></div></div></div></div></div><div class='column'><div class='ui items'><div class='item'><img class='ui avatar image' src='"+student_objects[partner_keys[key]].img+"'></img><div class='content'><div class='right floated content'>"+addPartnerButton+"</div><div class='header'>"+student_objects[partner_keys[key]].first_name+" "+student_objects[partner_keys[key]].last_name+"</div><div class='description'><div class='ui circular labels' style='margin-top:2.5px;'><a class='ui teal label'> score "+parseFloat(student_objects[partner_keys[key]].avg_score).toFixed(2)+"</a></div><div style='font-size: 12px;'>total active time: "+pad(parseInt(student_objects[partner_keys[key]].total_time/3600))+":"+pad(parseInt((student_objects[partner_keys[key]].total_time-(parseInt(student_objects[partner_keys[key]].total_time/3600)*3600))/60))+":"+pad(parseInt(student_objects[partner_keys[key]].total_time%60))+"</div></div></div></div></div></div></div><div class='ui vertical divider'> "+pairing_objective_str+" </div></li>")
      }
      count++;
    }
    if(!count) {
      $('.student-container').append("<div class='ui segment'><div class='ui two column very relaxed grid'><div class='column'><font>No student.</font></div><div class='column'><font>No student.</font></div></div><div class='ui vertical divider'> - </div></div>")
    } else {
      parameters = {pairing_session_id: pairing_session_id, section_id: section_id, partner_keys: JSON.stringify(partner_keys), pairing_objective: JSON.stringify(pairing_objective)}
      $('#confirm-pairing').attr('onclick', 'on_click_confirm_pairing_button('+JSON.stringify(parameters)+')')
      $('#alphabetical_filter').attr('onclick', 'onClickAlphabeticalFilterButton('+JSON.stringify(student_objects)+')')
      $('#avg_score_filter').attr('onclick', 'onClickAvgScoreFilterButton('+JSON.stringify(student_objects)+')')

      var active_filter = $('#active_filter').attr('value')
      if(active_filter == 'A-Z') {
        sort_A_to_Z(student_objects, completed_filter, hasElementMoving)
      } else if(active_filter == 'Z-A') {
        sort_Z_to_A(student_objects, completed_filter, hasElementMoving)
      } else if(active_filter == '1-100') {
        sort_avg_score_1_to_100(student_objects, completed_filter, hasElementMoving)
      } else if(active_filter == '100-1') {
        sort_avg_score_100_to_1(student_objects, completed_filter, hasElementMoving)
      }
    }
    $('#student_list_modal').modal('show');
  })
}

function onClickCreateSession(pairing_session_id, section_id, pairing_session_status){
  if($('#newPairingSession').attr('value') <= 0) {
    pairingOrViewingisHided('pair')
    showStudentList('pair', {}, {}, pairing_session_id, section_id)
  } else {
    $('#alert-header').text('Pairing session')
    $('#alert-message').text('Cannot create a new session! Please set current session to completed before create a new session.')
    $('#alert-modal').modal('show')
  }
}

function onClickCompletedSessionMenu(pairing_session_id, section_id){
  //console.log('pairing_session_id: ' + pairing_session_id)
  parameters = JSON.stringify({pairing_session_id: pairing_session_id, section_id: section_id, status: 0})
  $('#confirm-button').attr('onclick', 'on_click_confirm_button('+parameters+')')
  $('#confirm-header').text('Complete pairing session')
  $('#confirm-message').text('Are you sure you want to complete this pairing session?')
  $('#confirm-message').attr('value', 'Are you sure you want to complete this pairing session?')
  $('#confirm-modal').modal('show')
}

function pairingOrViewingisHided(command){
  if(command == 'pair') {
    $('#confirm-pairing').show()
    $('#cancel-pairing').show()
    $('#close_student_list').hide()
  } else if (command == 'view') {
    $('#confirm-pairing').hide()
    $('#cancel-pairing').hide()
    $('#close_student_list').show()
  }
}

function onClickViewPairingRecord(pairing_session_id, section_id) {
  pairingOrViewingisHided('view')
  showStudentList('view', {}, {}, pairing_session_id, section_id)
}

function onClickAssign(section_id, pairing_session_id, assignment_id, title, description, programming_style) {
  var parameters = {section_id: section_id, pairing_session_id: pairing_session_id, assignment_id: assignment_id, title: title, description: description, programming_style: programming_style}
  $('#inp_cm').attr('value', JSON.stringify(parameters))
  $('#confirm-header').text('Assign assignment')
  $('#confirm-message').attr('value', 'Are you sure you want to assign this assignment to all student pairs?')
  $('#confirm-message').text('Are you sure you want to assign this assignment to all student pairs?')
  $('#confirm-modal').modal('show');
}

function on_click_assign_button(assignment_of_week, pairing_session_id) {
  assignment_of_week = JSON.parse(assignment_of_week)
  let assignment_is_selected = []
  assignment_of_week.forEach(function(e){
    $('#'+e.assignment_id+'_is_selected').is(':checked') == true ? assignment_is_selected.push(e) : null
  })
  console.log('!assignment_is_selected.length, ', !assignment_is_selected.length, ', assignment_is_selected, ', assignment_is_selected)
  if(assignment_is_selected.length) {
    let parameters = JSON.stringify({assignment_set: assignment_is_selected, pairing_session_id: pairing_session_id})
    $('#confirm-button').attr('onclick', 'on_click_confirm_button('+parameters+')')
    $('#confirm-header').text('Assign assignment')
    $('#confirm-message').attr('value', 'Are you sure you want to assign these assignments to all student pairs?')
    $('#confirm-message').text('Are you sure you want to assign these assignments to all student pairs?')
    $('#confirm-modal').modal('show');
    // set_year(2019, 2020, 'year_a', 'dropdown')
    // set_month(1, 13, 'month_a', 'dropdown')
    // set_day(1, 32, 'day_a', 'dropdown')
    // set_hour(0, 24, 'endTimeHh_a', 'dropdown')
    // set_minute(0, 60, 'endTimeMm_a', 'dropdown')
    // set_second(0, 60, 'endTimeSs_a', 'dropdown')
    // $('#assign_now').attr('onclick', 'on_click_assign_now_button('+JSON.stringify(assignment_is_selected)+', '+pairing_session_id+')')
    // $('#assignment-end-time-modal').modal('show');
  } else {
    $('#alert-header').text('Select assignment')
    $('#alert-message').text('Please!!!, select an assignment before click the \"Assign\" button.')
    $('#alert-modal').modal('show')
  }
}

// function on_click_assign_now_button(assignment_set, pairing_session_id) {
//   let end_time = $('#year_a').val() + '-' + $('#month_a').val() + '-' + $('#day_a').val() + 'T' + $('#endTimeHh_a').val() + ':' + $('#endTimeMm_a').val() + ':' + $('#endTimeSs_a').val() + 'Z'
//   let parameters = JSON.stringify({assignment_set: assignment_set, pairing_session_id: pairing_session_id, end_time: end_time})
//   $('#confirm-button').attr('onclick', 'on_click_confirm_button('+parameters+')')
//   $('#confirm-header').text('Assign assignment')
//   $('#confirm-message').attr('value', 'Are you sure you want to assign these assignments to all student pairs?')
//   $('#confirm-message').text('Are you sure you want to assign these assignments to all student pairs?')
//   $('#confirm-modal').modal('show');
// }

function onClickDeleteAssignment(assignment_of_week) {
  let assignment_is_selected = []
  assignment_of_week.forEach(function(e){
    $('#'+e.assignment_id+'_is_selected').is(':checked') == true ? assignment_is_selected.push(e) : null
  })
  console.log('!assignment_is_selected.length, ', !assignment_is_selected.length, ', assignment_is_selected, ', assignment_is_selected)
  if(!assignment_is_selected.length) {
    $('#alert-header').text('Select assignment')
    $('#alert-message').text('Please!!!, select an assignment before click the \"Delete\" button.')
    $('#alert-modal').modal('show')
  } else {
    let parameters = JSON.stringify({assignment_is_selected: assignment_is_selected})
    $('#confirm-button').attr('onclick', 'on_click_confirm_button('+parameters+')')
    $('#confirm-header').text('Delete assignments')
    $('#confirm-message').attr('value', 'Are you sure you want to delete these assignment?')
    $('#confirm-message').text('Are you sure you want to delete these assignment?')
    $('#confirm-modal').modal('show');
  }

}

function on_click_enable_assignment_button() {
  $('#dropdown_amd').empty()
  $('#dropdown_amd').append('<input id=\'week_input_amd\' type=\'hidden\'></input>')
  $('#dropdown_amd').append('<i class=\'dropdown icon\'></i>')
  $('#dropdown_amd').append('<div class=\'default text\'>Week</div>')
  $('#dropdown_amd').append('<div id=\'week_amd\' class=\'menu\'></div>')
  $.get('/classroom/getAssignmentWeek', {action: 'enable'}, function(res) {
    let weeks = JSON.parse(res.weeks)
    if(!weeks.length) {
      $('#week_amd').append('<div class=\'item\' id=\'-1_week_in_dam\' data-value=\'-1\'>No disable assignment.</div>')
    } else if (weeks.length) {
      $('#week_amd').append('<div class=\'item\' id=\'0_week_in_dam\' data-value=\'0\'>All</div>')
    }
    weeks.forEach(function (e){
      $('#week_amd').append('<div class=\'item\' id=\''+e+'_week_in_dam\' data-value=\''+e+'\'>'+e+'</div>')
    })
    $('#confirm_assignment_management').attr('onclick', 'on_click_confirm_assignment_management_button(\'enable\')')
    $('#header_amd').text('Enable Assignment')
    $('#assignment_management_modal').modal('show')
    $('#dropdown_amd').dropdown();
  })
}

function on_click_disable_assignment_button() {
  $('#dropdown_amd').empty()
  $('#dropdown_amd').append('<input id=\'week_input_amd\' type=\'hidden\'></input>')
  $('#dropdown_amd').append('<i class=\'dropdown icon\'></i>')
  $('#dropdown_amd').append('<div class=\'default text\'>Week</div>')
  $('#dropdown_amd').append('<div id=\'week_amd\' class=\'menu\'></div>')
  $.get('/classroom/getAssignmentWeek', {action: 'disable'}, function(res) {
    let weeks = JSON.parse(res.weeks)
    if(!weeks.length) {
      $('#week_amd').append('<div class=\'item\' id=\'-1_week_in_dam\' data-value=\'-1\'>Not yet assigned assignment.</div>')
    } else if (weeks.length) {
      $('#week_amd').append('<div class=\'item\' id=\'0_week_in_dam\' data-value=\'0\'>All</div>')
    }
    weeks.forEach(function (e){
      $('#week_amd').append('<div class=\'item\' id=\''+e+'_week_in_dam\' data-value=\''+e+'\'>'+e+'</div>')
    })
    $('#header_amd').text('Disable Assignment')
    $('#confirm_assignment_management').attr('onclick', 'on_click_confirm_assignment_management_button(\'disable\')')
    $('#assignment_management_modal').modal('show')
    $('#dropdown_amd').dropdown();
  })
}

function on_click_confirm_assignment_management_button(action) {
  if(action == 'enable') {
    parameters = JSON.stringify({week: $('#week_input_amd').val(), action: 'enable'})
    $('#confirm-button').attr('onclick', 'on_click_confirm_button('+parameters+')')
    $('#confirm-header').text('Disable Assignment')
    $('#confirm-message').attr('value', 'Are you sure you want to disable assignments on this week?')
    $('#confirm-message').text('Are you sure you want to disable assignments on this week?')
    $('#confirm-modal').modal('show')
  } else if (action == 'disable') {
    parameters = JSON.stringify({week: $('#week_input_amd').val(), action: 'disable'})
    $('#confirm-button').attr('onclick', 'on_click_confirm_button('+parameters+')')
    $('#confirm-header').text('Enable Assignment')
    $('#confirm-message').attr('value', 'Are you sure you want to enable assignments on this week?')
    $('#confirm-message').text('Are you sure you want to enable assignments on this week?')
    $('#confirm-modal').modal('show')
  }
}

function on_click_remove_student_button(enrollment_id, first_name, last_name) {
  parameters = JSON.stringify({enrollment_id: enrollment_id})
  console.log('enrollment_id, ', enrollment_id)
  $('#confirm-button').attr('onclick', 'on_click_confirm_button('+parameters+')')
  $('#confirm-header').text('Remove Student')
  $('#confirm-message').attr('value', 'Are you sure you want to remove the student from this classroom?')
  $('#confirm-message').text('Are you sure you want to remove \"' + first_name + ' ' + last_name + '\" from this classroom?')
  $('#confirm-modal').modal('show')
}

function get_items_of_week(items, range, week) {
  week = week.split('week')
  week = parseInt(week[0])
  let items_of_week = []

  for (_index in items){
    if(items[_index].week == week) {
      items_of_week.push(items[_index])
    } else if (week < 0) {
      items_of_week.push(items[_index])
    }
  }

  let pagination = []
  let page = 1;
  let count = 0;
  for (_index in items_of_week) {
    items_of_week[_index].page = page
    count++
    if(count % range == 0 || _index == (items_of_week.length) - 1) {
      pagination.indexOf(page) == -1 ? pagination.push(page) : null;
      page++
    }
  }

  return {items_of_week: items_of_week, pagination: pagination}
}

function checkbox_event(assignment_set, id, opt) {
  let assignment_of_week_ = get_items_of_week(assignment_set, 5, id).items_of_week
  switch (opt) {
    //on click the "Check All of Box" button
    case 1:
      assignment_of_week_.forEach(function(e){
        $('#'+e.assignment_id+'_is_selected').prop('checked', true)
      })

      break;
    //on click the "Clear Checkbox" button
    default:
      assignment_of_week_.forEach(function(e){
        $('#'+e.assignment_id+'_is_selected').prop('checked', false)
      })
  }
}

function on_click_button_in_uspm(id) {
  console.log('element_id_in_uspm, ', id)
  $('.item.active.uspm').attr({
    class: 'item uspm'
  })
  $('#'+id).attr({
    class: 'item active uspm'
  })

  $('.segment.active.uspm').attr({
    class: 'ui segment uspm',
    style: 'display: none'
  })
  $('#'+id+'_segment').attr({
    class: 'ui segment active uspm',
    style: 'display: block'
  })
}

function create_weeks_dropdown(id, pairing_session_id, data_set) {
  $(''+id).append('<div class=\'item\' id=\'-1week\' data-value=\'-1\' onclick=\'on_click_weeks_dropdown(\"-1week\", '+data_set.assignments+', \"'+data_set.username+'\", \"'+data_set.img+'\", '+pairing_session_id+', 0)\'>All</div>')
  data_set.weeks.forEach(function (e){
    $(''+id).append('<div class=\'item\' id=\''+e+'week\' data-value=\''+e+'\' onclick=\'on_click_weeks_dropdown(\"'+e+'week\", '+data_set.assignments+', \"'+data_set.username+'\", \"'+data_set.img+'\", '+pairing_session_id+', 0)\'>'+e+'</div>')
  })
}

function on_click_weeks_dropdown(id, assignment_set, username, img, pairing_session_id, opt) {
  console.log('pairing_session_id, ', pairing_session_id)
  assignment_set = assignment_set
  let res_obj = get_items_of_week(assignment_set, 5, id)
  let assignment_of_week_ = res_obj.items_of_week
  let pagination = res_obj.pagination
  console.log('assignment_of_week_, ', assignment_of_week_)

  set_item_pagination_in_first_container(pagination, assignment_of_week_, username, img, id, opt)

  $('#assign_button').attr('onclick', 'on_click_assign_button('+JSON.stringify(JSON.stringify(assignment_of_week_))+', '+pairing_session_id+')')
  $('#delete_assignment_button').attr('onclick', 'onClickDeleteAssignment('+JSON.stringify(assignment_of_week_)+')')
  $('div').remove('#assignment_pagination')
  if(pagination[pagination.length - 1] == 1) {
    pagination = []
  } else if(pagination.length) {
    $('<div class=\'ui pagination menu\' id=\'assignment_pagination\'></div>').insertAfter('#divider_in_first_container')
  }

  let item = null;

  for(_index in pagination) {
    item = $('<a class=\'item fc\' id=\'page_'+pagination[_index]+'_first_container\' onclick=\'on_click_page_number_in_first_container('+pagination[_index]+')\'>'+pagination[_index]+'</a>')
    $('#assignment_pagination').append(item)
  }

  on_click_page_number_in_first_container(1)
}

function on_click_page_number_in_first_container(page) {
  $('.active.item.fc').attr({
    class: 'item fc'
  })
  $('#page_'+page+'_first_container').attr({
    class: 'active item fc'
  })

  $('.active.first.container').attr({
    class: 'ui divided items first container',
    style: 'display: none'
  })
  $('#items_first_container'+page).attr({
    class: 'ui divided items active first container',
    style: 'display: block'
  })
}

function set_item_pagination_in_first_container(pagination, items_of_week, username, img, week, opt) {
  let item = null;
  let content = null;
  let grid = null;
  let description = null;
  $('div').remove('.active.first.container')
  $('div').remove('.items.first.container')

  $('p').remove('#no_assignment')
  if(!pagination.length) $('#segment_in_first_container').append('<p class=\'text-center\' id=\'no_assignment\'>No assignment.</p>')

  for (_index_p in pagination) {

    $('div').remove('#items_first_container'+pagination[_index_p])
    $('#segment_in_first_container').append('<div class=\'ui divided items first container\' id=\'items_first_container'+pagination[_index_p]+'\'></div>')

    if(pagination[_index_p] == 1) {
      $('#items_first_container'+pagination[_index_p]).attr('class', 'ui divided items active first container')
    } else if(pagination[_index_p] > 1) {
      $('#items_first_container'+pagination[_index_p]).attr('style', 'display: none')
    }

    for (_index_i in items_of_week) {
      if(items_of_week[_index_i].page == pagination[_index_p]) {
        switch (opt) {
          case 0:
            let fourteen_wide_column = null;
            let two_wide_column = null;
            let checkbox = null;
            let assignment = items_of_week[_index_i];
            item = $('<div class=\'item\' id=\'a'+assignment.assignment_id+'\'></div>')
            content = $('<div class=\'content\'><b style=\'font-size:1.5em; padding-left:15px; padding-right:15px;\'><a class=\'header\' href=\'/assignment?section_id='+assignment.section_id+'&assignment_id='+assignment.assignment_id+'\'>'+assignment.title+'</b></div>')
            description = $('<div class=\'description\'>')
            grid = $('<div class=\'ui grid\'></div>')
            fourteen_wide_column = $('<div class=\'fourteen wide column assignment_is_selected\' onclick=\'on_click_assignment(1, \"'+assignment.assignment_id+'_is_selected\")\'><p style=\'padding-left:15px; padding-right:15px;\'>'+assignment.description+'</p><p style=\'padding-left:15px; padding-right:15px;\'>Programming Style : '+assignment.programming_style+'</p></div>')
            two_wide_column = $('<div class=\'two wide column\'></div>')
            checkbox = $('<div class=\'ui checkbox\'><input class=\'checkbox_is_clicked\' type=\'checkbox\' id=\''+assignment.assignment_id+'_is_selected\' onclick=\'on_click_assignment(0, \"'+assignment.assignment_id+'_is_selected\")\'/><label></label></div>')
            item.append(content)
            content.append(description)
            description.append(grid)
            grid.append(fourteen_wide_column)
            grid.append(two_wide_column)
            two_wide_column.append(checkbox)
            $('#items_first_container'+pagination[_index_p]).append(item)
            break;
          default:
            let project = items_of_week[_index_i]
            let section_id = project.section_id
            let div_a = null
            let img1 = null
            let img2 = null
            let img3 = null
            let eleven_wide_column = null
            if(project.creator == username) {
              item = $('<div class=\'item\' style=\'padding-top:10px; padding-bottom:10px;\'></div>')
              div_a = $('<a href=\'/project?pid='+project.pid+'&user_role=creator&section_id='+section_id+'\' class=\'ui tiny image\' ></a>')
              img1 = $('<img src=\'/images/blue-folder.png\', style=\'position: absolute;\'/>')
              img2 = $('<img class=\'ui avatar image\' src=\''+img+'\', style=\'width: 30px;height: 30px;left:25px;top: 20px;\'/>')
              content = $('<div class=\'content\'></div>')
              grid = $('<div class=\'ui grid\'></div>')
              eleven_wide_column = $('<div class=\'eleven wide column\'><b style=\'font-size:1.2em;\'><a class=\'header\' href=\'/project?pid='+project.pid+'&user_role=creator&section_id='+section_id+'\'>'+project.title+'</a></b></div>')
              description = $('<div class=\'description\'>'+project.description+'<br> Last updated '+moment(project.active_time).fromNow()+'</div>')
              div_a.append(img1)
              div_a.append(img2)
              content.append(grid)
              grid.append(eleven_wide_column)
              eleven_wide_column.append(description)
              item.append(div_a)
              item.append(content)
            } else {
              item = $('<div class=\'item\' style=\'padding-top:10px;\'></div>')
              div_a = $('<a class=\'ui tiny image\' href=\'/project?pid='+project.pid+'&user_role=collaborator&section_id='+section_id+'\'></a>')
              img1 = $('<img src=\'/images/yellow-folder.png\', style=\'position: absolute;\'/>')
              img2 = $('<img class=\'img-owner ui avatar image\' src=\''+img+'\', style=\'width: 30px;height: 30px; top: 20px;\'/>')
              img3 = $('<img class=\'img-partner ui avatar image\' src=\'/images/user_img_4.jpg\', style=\'width:30px; height:30px; top:-10px;\'/>')
              content = $('<div class=\'content\'><b style=\'font-size:1.2em;\'><a href=\'/project?pid='+project.pid+'&user_role=collaborator&section_id='+section_id+'\'>'+project.title+'</a></b></div>')
              description = $('<div class=\'description\' style=\'margin-top:0px;\'>'+project.description+'<br> Last updated '+moment(project.active_time).fromNow()+'</div>')
              div_a.append(img1)
              div_a.append(img2)
              div_a.append(img3)
              content.append(description)
              item.append(div_a)
              item.append(content)
            }
            $('#items_first_container'+pagination[_index_p]).append(item)
        }
      }
    }
  }
}

function on_click_page_number_in_second_container(page) {
  $('.active.item.sc').attr({
    class: 'item sc'
  })
  $('#page_'+page+'_second_container').attr({
    class: 'active item sc'
  })

  $('.active.second.container').attr({
    class: 'ui middle aligned divided list second container',
    style: 'display: none'
  })
  $('#items_second_container'+page).attr({
    class: 'ui middle aligned divided list active second container',
    style: 'display: block'
  })
}

function set_item_pagination_in_second_container(students, section_id, occupation) {
  let res_obj = get_items_of_week(students, 10, '-1week')
  students = res_obj.items_of_week
  let pagination = res_obj.pagination

  let item = null
  let student = null
  let content = null
  let img = null

  for (_index_p in pagination) {

    $('div').remove('#items_second_container'+pagination[_index_p])
    $('#segment_in_second_container').append('<div class=\'ui middle aligned divided list second container\' id=\'items_second_container'+pagination[_index_p]+'\'></div>')

    if(pagination[_index_p] == 1) {
      $('#items_second_container'+pagination[_index_p]).attr('class', 'ui middle aligned divided list active second container')
    } else if(pagination[_index_p] > 1) {
      $('#items_second_container'+pagination[_index_p]).attr('style', 'display: none')
    }

    for (_index_s in students) {
      if(students[_index_s].page == pagination[_index_p]) {
        student = students[_index_s]
        item = $('<div class=\'item\' id=\''+student.enrollment_id+'\' style=\'padding-left:15px; padding-right:15px;\'></div>')
        img = $('<img class=\'ui avatar image\' src=\'images/user_img_0.jpg\'/>')
        switch (occupation) {
          case "teacher":
            let right_floated_content = null
            let tag_a = null
            right_floated_content = $('<div class=\'right floated content\'></div>')
            tag_a = $('<a class=\'ui right floated aligedvertical animated button red\' onclick=\'on_click_remove_student_button('+student.enrollment_id+',\"'+student.first_name+'\",\"'+student.last_name+'\")\'><div class=\'hidden content\' style=\'color:white\'> Remove </div><div class=\'visible content\'><i class=\'sign out icon\'/></div></a>')
            content = $('<div class=\'content\'><a href=\'/profile?section_id='+section_id+'&username='+student.username+'\'><p> '+student.first_name+' '+student.last_name+' </p></a></div>')
            right_floated_content.append(tag_a)
            item.append(right_floated_content)
            item.append(img)
            item.append(content)

            break;
          default:
            content = $('<div class=\'content\'><p> '+student.first_name+' '+student.last_name+' </p></div>')
            item.append(img)
            item.append(content)
        }
        $('#items_second_container'+pagination[_index_p]).append(item)
      }
    }
  }

  $('div').remove('#student_pagination')
  if(pagination[pagination.length - 1] == 1) {
    pagination = []
  } else {
    $('<div class=\'ui pagination menu\' id=\'student_pagination\'></div>').insertAfter('#ui_two_column_in_second_container')
  }

  item = null;
  for(_index in pagination) {
    item = $('<a class=\'item sc\' id=\'page_'+pagination[_index]+'_second_container\' onclick=\'on_click_page_number_in_second_container('+pagination[_index]+')\'>'+pagination[_index]+'</a>')
    $('#student_pagination').append(item)
  }

}

function on_click_page_number_in_third_container(page) {
  $('.active.item.tc').attr({
    class: 'item tc'
  })
  $('#page_'+page+'_third_container').attr({
    class: 'active item tc'
  })

  $('.active.third.container').attr({
    class: 'ui divided items third container',
    style: 'display: none'
  })
  $('#items_third_container'+page).attr({
    class: 'ui divided items active third container',
    style: 'display: block'
  })
}

function set_item_pagination_in_third_container(objects, section_id, occupation) {
  let res_obj = get_items_of_week(objects, 5, '-1week')
  objects = res_obj.items_of_week
  let pagination = res_obj.pagination

  let item = null
  let content = null
  let description = null
  let pairing_times = objects.length

  for (_index_p in pagination) {

    $('div').remove('#items_third_container'+pagination[_index_p])
    $('#segment_in_third_container').append('<div class=\'ui divided items third container\' id=\'items_third_container'+pagination[_index_p]+'\'></div>')

    if(pagination[_index_p] == 1) {
      $('#items_third_container'+pagination[_index_p]).attr('class', 'ui divided items active third containerr')
    } else if(pagination[_index_p] > 1) {
      $('#items_third_container'+pagination[_index_p]).attr('style', 'display: none')
    }

    for (_index_o in objects) {
      if(objects[_index_o].page == pagination[_index_p]) {
        switch (occupation) {
          case "teacher":
            let grid = null
            let extra = null
            let eleven_wide_column = null
            let tag_b = null
            let five_wide_column = null
            let button = null
            let pairing_session = objects[_index_o]
            item = $('<div class=\'item\' style=\'padding-top:10px; padding-bottom:10px; padding-left:15px; padding-right:15px;\'></div>')
            content = $('<div class=\'content\'></div>')
            grid = $('<div class=\'ui grid\'></div>')
            eleven_wide_column = $('<div class=\'eleven wide column\'></div>')
            five_wide_column = $('<div class=\'five wide column\'></div>')
            if(pairing_session.status == 0) {
              console.log('pairing_session.status, ', pairing_session.status)
              tag_b = $('<b style=\'font-size:1.5em;\'><header style=\'color:#5D5D5D;\'> Session : '+(pairing_times - _index_o)+' </header></b>')
              description = $('<p><b style=\'color:#5D5D5D\'> Start at : </b><font style=\'color:#5D5D5D\'>'+pairing_session.time_start+'</font><br><b style=\'color:#5D5D5D\'> End at : </b><font style=\'color:#5D5D5D\'>'+pairing_session.time_end+'</font></p>')
              button = $('<div class=\'ui right floated alignedvertical animated button\' onclick=\'onClickViewPairingRecord('+pairing_session.pairing_session_id+', \"'+section_id+'\")\'><div class=\'hidden content\' style=\'color:#5D5D5D;\'> View </div><div class=\'visible content\'><i class=\'eye icon\'/></div></div>')
              extra = $('<div class=\'extra\'><div class=\'ui label\' id=\'status\' style=\'background-color:#E8E8E8; color:#665D5D;\'> COMPLETED </div></div>')
            } else {
              tag_b = $('<b style=\'font-size:1.5em;\'><header> Session : '+(pairing_times - _index_o)+' </header></b>')
              description = $('<p><b> Start at : </b><font>'+pairing_session.time_start+'</font><br><b> End at : </b><font>'+pairing_session.time_end+'</font></p>')
              button = $('<div class=\'ui top right floated pointing dropdown button blue\' ><font color=\'white\'> Select </font><div class=\'menu\'><div class=\'item\' onclick=\'onClickViewPairingRecord('+pairing_session.pairing_session_id+', \"'+section_id+'\")\'> View </div><div class=\'item\' onclick=\'onClickCompletedSessionMenu('+pairing_session.pairing_session_id+', \"'+section_id+'\")\'> Completed </div></div></div>')
              extra = $('<div class=\'extra\'><div class=\'ui label\' id=\'status\' style=\'background-color:#16AB39; color:white;\'> ACTIVE </div></div>')
            }
            item.append(content)
            content.append(grid)
            content.append(extra)
            grid.append(eleven_wide_column)
            grid.append(five_wide_column)
            eleven_wide_column.append(tag_b)
            eleven_wide_column.append(description)
            five_wide_column.append(button)
            $('#items_third_container'+pagination[_index_p]).append(item)


            break;
          default:
            let assignment = objects[_index_o]
            let tag_a = null
            item = $('<div class=\'item\'></div>')
            content = $('<div class=\'content\'></div>')
            tag_a = $('<a href=\'/assignment?section_id='+section_id+'&assignment_id='+assignment.assignment_id+'\'><b style=\'font-size:1.5em; padding-left:15px; padding-right:15px;\'>'+assignment.title+'</b></a>')
            description = $('<div class=\'description\'><p style=\'padding-left:15px; padding-right:15px;\'>'+assignment.description+'</p></div>')
            item.append(content)
            content.append(tag_a)
            content.append(description)
            $('#items_third_container'+pagination[_index_p]).append(item)
        }
      }
    }

  }

  $('div').remove('#pagination_in_third_container')
  if(pagination[pagination.length - 1] == 1) {
    pagination = []
  } else {
    $('<div class=\'ui pagination menu\' id=\'pagination_in_third_container\'></div>').insertAfter('#ui_two_column_in_third_container')
  }

  item = null;
  for(_index in pagination) {
    item = $('<a class=\'item tc\' id=\'page_'+pagination[_index]+'_third_container\' onclick=\'on_click_page_number_in_third_container('+pagination[_index]+')\'>'+pagination[_index]+'</a>')
    $('#pagination_in_third_container').append(item)
  }

}

function on_click_change_pair(pairing_session_id, section_id) {
  let parameters = {pairing_session_id: pairing_session_id, section_id: section_id}
  $.get('/classroom/getPairing', parameters, function(data) {
    if(data.status == 'Pull information successfully'){
      // $('#autoPairing').attr('onclick', 'onClickAutoPairingBtn(\"pair\", '+JSON.stringify(data.partner_keys)+', '+JSON.stringify(data.pairing_objective)+', '+data.pairing_session_id+', \"'+data.section_id+'\")')
      $('#autoPairing').show()
      $('#cloning_partner_keys').attr('value', data.partner_keys)
      $('#cloning_pairing_objective').attr('value', data.pairing_objective)
      $('#confirm-pairing').attr('value', 'change')
      $('#confirm-header').text('Alert!')
      $('#confirm-message').text('Something message.')
      $('#confirm-message').attr('value', 'Something message.')
      showStudentList('pair', JSON.parse(data.partner_keys), JSON.parse(data.pairing_objective), data.pairing_session_id, data.section_id)
      pairingOrViewingisHided('pair')
      alert(data.status)
    } else {
      alert(data.status)
    }
  })
}

function onClickAutoPairingBtn(command, pairingSessionId, sectionId) {
  $('#expertWithExpert').attr('onclick', 'onClickPairingPurposeRadioBtn(\"expertWithExpert\", \"'+command+'\", '+pairingSessionId+', \"'+sectionId+'\")')
  $('#expertWithNovice').attr('onclick', 'onClickPairingPurposeRadioBtn(\"expertWithNovice\", \"'+command+'\", '+pairingSessionId+', \"'+sectionId+'\")')
  $('#noviceWithNovice').attr('onclick', 'onClickPairingPurposeRadioBtn(\"noviceWithNovice\", \"'+command+'\", '+pairingSessionId+', \"'+sectionId+'\")')
  $('#qualityOriented').attr('onclick', 'onClickPairingPurposeRadioBtn(\"quality\", \"'+command+'\", '+pairingSessionId+', \"'+sectionId+'\")')
  $('#mutualLearning').attr('onclick', 'onClickPairingPurposeRadioBtn(\"experience\", \"'+command+'\", '+pairingSessionId+', \"'+sectionId+'\")')
  $('#teachingAndLearning').attr('onclick', 'onClickPairingPurposeRadioBtn(\"train\", \"'+command+'\", '+pairingSessionId+', \"'+sectionId+'\")')
  $('#pairingSettingsModal').modal('show');
}

function onClickStartAutoPairingBtn(pairingPurpose, command, pairingSessionId, sectionId) {
  if (pairingPurpose) {
    parameters = {pairingPurpose: pairingPurpose, command: command, pairingSessionId: pairingSessionId, sectionId: sectionId}
    $('#confirm-button').attr('onclick', 'on_click_confirm_button('+JSON.stringify(parameters)+')')
    $('#confirm-header').text('Start Auto Pairing')
    $('#confirm-message').text('Are you sure you want to start auto pairing?')
    $('#confirm-message').attr('value', 'Are you sure you want to start auto pairing?')
    $('#confirm-modal').modal('show')
  } else {
    alert('Please select a pairing purpose choice before click the \"Start\" button.')
    $('#student_list_modal').modal('show')
  }
}

function onClickPairingPurposeRadioBtn(pairingPurpose, command, pairingSessionId, sectionId) {
  $('#startAutoPairingBtn').attr('onclick', 'onClickStartAutoPairingBtn(\"'+pairingPurpose+'\", \"'+command+'\", '+pairingSessionId+', \"'+sectionId+'\")')
}

function onClickAlphabeticalFilterButton(student_objects){

  var completed_filter = false
  var hasElementMoving = false

  var active_filter = $('#active_filter').attr('value')
  if(active_filter == '1-100' || active_filter == '100-1' || active_filter == '') {
    $('#avg_score_filter').attr('class', 'ui button')
    $('#alphabetical_filter').attr('class', 'ui grey button')

    $('#avg_score_filter').attr('value', '1-100')
    $('#avg_score_filter').text('1-100')
  }

  if($('#alphabetical_filter').attr('value') == 'A-Z') {
    $('#alphabetical_filter').attr('value', 'Z-A')
    $('#alphabetical_filter').text('Z-A')


    $('#active_filter').attr('value', 'A-Z')

    sort_A_to_Z(student_objects, completed_filter, hasElementMoving)

  } else if($('#alphabetical_filter').attr('value') == 'Z-A') {
    $('#alphabetical_filter').attr('value', 'A-Z')
    $('#alphabetical_filter').text('A-Z')

    $('#active_filter').attr('value', 'Z-A')

    sort_Z_to_A(student_objects, completed_filter, hasElementMoving)
  }
}

function onClickAvgScoreFilterButton(student_objects) {

  var completed_filter = false
  var hasElementMoving = false

  var active_filter = $('#active_filter').attr('value')
  if(active_filter == 'A-Z' || active_filter == 'Z-A' || active_filter == '') {
    $('#avg_score_filter').attr('class', 'ui grey button')
    $('#alphabetical_filter').attr('class', 'ui button')

    $('#alphabetical_filter').attr('value', 'A-Z')
    $('#alphabetical_filter').text('A-Z')
  }

  if($('#avg_score_filter').attr('value') == '1-100') {
    $('#avg_score_filter').attr('value', '100-1')
    $('#avg_score_filter').text('100-1')

    $('#active_filter').attr('value', '1-100')

    sort_avg_score_1_to_100(student_objects, completed_filter, hasElementMoving)

  } else if($('#avg_score_filter').attr('value') == '100-1') {
    $('#avg_score_filter').attr('value', '1-100')
    $('#avg_score_filter').text('1-100')

    $('#active_filter').attr('value', '100-1')

    sort_avg_score_100_to_1(student_objects, completed_filter, hasElementMoving)

  }
}

function set_year(start, end, id, input_type) {
  $('#'+id).empty()
  for(i = start; i < end; i++){
    if(input_type == 'dropdown') {
      let value = i.toString()
      if(value.length == 1) {
        value = '0' + value
      }
      $('#'+id).append('<option value=\''+value+'\'>'+value+'</option>')
    }
  }
}

function set_month(start, end, id, input_type) {
  $('#'+id).empty()
  for(i = start; i < end; i++){
    if(input_type == 'dropdown') {
      let value = i.toString()
      if(value.length == 1) {
        value = '0' + value
      }
      $('#'+id).append('<option value=\''+value+'\'>'+value+'</option>')
    }
  }
}

function set_day(start, end, id, input_type) {
  $('#'+id).empty()
  for(i = start; i < end; i++){
    if(input_type == 'dropdown') {
      let value = i.toString()
      if(value.length == 1) {
        value = '0' + value
      }
      $('#'+id).append('<option value=\''+value+'\'>'+value+'</option>')
    }
  }
}

function set_hour(start, end, id, input_type) {
  $('#'+id).empty()
  for(i = start; i < end; i++){
    if(input_type == 'dropdown') {
      let value = i.toString()
      if(value.length == 1) {
        value = '0' + value
      }
      $('#'+id).append('<option value=\''+value+'\'>'+value+'</option>')
    }
  }
}

function set_minute(start, end, id, input_type) {
  $('#'+id).empty()
  for(i = start; i < end; i++){
    if(input_type == 'dropdown') {
      let value = i.toString()
      if(value.length == 1) {
        value = '0' + value
      }
      $('#'+id).append('<option value=\''+value+'\'>'+value+'</option>')
    }
  }
}

function set_second(start, end, id, input_type) {
  $('#'+id).empty()
  for(i = start; i < end; i++){
    if(input_type == 'dropdown') {
      let value = i.toString()
      if(value.length == 1) {
        value = '0' + value
      }
      $('#'+id).append('<option value=\''+value+'\'>'+value+'</option>')
    }
  }
}

function sort_A_to_Z(student_objects, completed_filter, hasElementMoving){
  while(!completed_filter) {
    $('li.ui.segment').filter(function(indx){
      var key = $(this).attr('id')
      var name = (student_objects[key].first_name + ' ' + student_objects[key].last_name).toLowerCase()
      var index = indx

      $('li.ui.segment').filter(function(indx){
        key = $(this).attr('id')
        var _name = (student_objects[key].first_name + ' ' + student_objects[key].last_name).toLowerCase()
        var _index = indx
        var max_length = name.length > _name.length ? _name.length : name.length
        if(name != _name) {
          if(index < _index) {
            for (i = 0; i <= max_length; i++){
              if(name.charCodeAt(i) > _name.charCodeAt(i)) {
                $(this).parent().find("li").eq(index).insertAfter($(this));
                index = _index
                hasElementMoving = true;
                break;
              } else if (name.charCodeAt(i) < _name.charCodeAt(i)) {
                break;
              }
            }
          } else if(index > _index) {
            for (i = 0; i <= max_length; i++){
              if(name.charCodeAt(i) < _name.charCodeAt(i)) {
                $(this).insertAfter($(this).parent().find("li").eq(index));
                index = _index
                hasElementMoving = true;
                break;
              } else if (name.charCodeAt(i) > _name.charCodeAt(i)) {
                break;
              }
            }
          }
        }
      })
    })

    if(hasElementMoving) {
      completed_filter = false
    } else {
      completed_filter = true
    }

    hasElementMoving = false
  }
}

function sort_Z_to_A(student_objects, completed_filter, hasElementMoving){

  while(!completed_filter) {
    $('li.ui.segment').filter(function(indx){
      var key = $(this).attr('id')
      var name = (student_objects[key].first_name + ' ' + student_objects[key].last_name).toLowerCase()
      var index = indx

      $('li.ui.segment').filter(function(indx){
        key = $(this).attr('id')
        var _name = (student_objects[key].first_name + ' ' + student_objects[key].last_name).toLowerCase()
        var _index = indx
        var max_length = name.length > _name.length ? _name.length : name.length
        if(name != _name) {
          if(index < _index) {
            for (i = 0; i <= max_length; i++){
              if(name.charCodeAt(i) < _name.charCodeAt(i)) {
                $(this).parent().find("li").eq(index).insertAfter($(this));
                index = _index
                hasElementMoving = true;
                break;
              } else if (name.charCodeAt(i) > _name.charCodeAt(i)) {
                break;
              }
            }
          } else if(index > _index) {
            for (i = 0; i <= max_length; i++){
              if(name.charCodeAt(i) > _name.charCodeAt(i)) {
                $(this).insertAfter($(this).parent().find("li").eq(index));
                index = _index
                hasElementMoving = true;
                break;
              } else if (name.charCodeAt(i) < _name.charCodeAt(i)) {
                break;
              }
            }
          }
        }
      })
    })

    if(hasElementMoving) {
      completed_filter = false
    } else {
      completed_filter = true
    }

    hasElementMoving = false
  }

}

function sort_avg_score_1_to_100(student_objects, completed_filter, hasElementMoving){

  while(!completed_filter) {
    $('li.ui.segment').filter(function(indx){
      var key = $(this).attr('id')
      var avg_score = student_objects[key].avg_score
      var name = (student_objects[key].first_name + ' ' + student_objects[key].last_name).toLowerCase()
      var index = indx

      $('li.ui.segment').filter(function(indx){
        key = $(this).attr('id')
        var _avg_score = student_objects[key].avg_score
        var _name = (student_objects[key].first_name + ' ' + student_objects[key].last_name).toLowerCase()
        var _index = indx
        var max_length = name.length > _name.length ? _name.length : name.length
        if(avg_score != _avg_score) {
          if(index < _index) {
            if(avg_score > _avg_score) {
              $(this).parent().find("li").eq(index).insertAfter($(this));
              index = _index
              hasElementMoving = true;
            }
          } else if(index > _index) {
            if(avg_score < _avg_score) {
              $(this).insertAfter($(this).parent().find("li").eq(index));
              index = _index
              hasElementMoving = true;
            }
          }
        } else if(avg_score == _avg_score) {
          if(name != _name) {
            if(index < _index) {
              for (i = 0; i <= max_length; i++){
                if(name.charCodeAt(i) > _name.charCodeAt(i)) {
                  $(this).parent().find("li").eq(index).insertAfter($(this));
                  index = _index
                  hasElementMoving = true;
                  break;
                } else if (name.charCodeAt(i) < _name.charCodeAt(i)) {
                  break;
                }
              }
            } else if(index > _index) {
              for (i = 0; i <= max_length; i++){
                if(name.charCodeAt(i) < _name.charCodeAt(i)) {
                  $(this).insertAfter($(this).parent().find("li").eq(index));
                  index = _index
                  hasElementMoving = true;
                  break;
                } else if (name.charCodeAt(i) > _name.charCodeAt(i)) {
                  break;
                }
              }
            }
          }
        }
      })
    })

    if(hasElementMoving) {
      completed_filter = false
    } else {
      completed_filter = true
    }

    hasElementMoving = false
  }

}

function sort_avg_score_100_to_1(student_objects, completed_filter, hasElementMoving){

  while(!completed_filter) {
    $('li.ui.segment').filter(function(indx){
      var key = $(this).attr('id')
      var avg_score = student_objects[key].avg_score
      var name = (student_objects[key].first_name + ' ' + student_objects[key].last_name).toLowerCase()
      var index = indx

      $('li.ui.segment').filter(function(indx){
        key = $(this).attr('id')
        var _avg_score = student_objects[key].avg_score
        var _name = (student_objects[key].first_name + ' ' + student_objects[key].last_name).toLowerCase()
        var _index = indx
        var max_length = name.length > _name.length ? _name.length : name.length
        if(avg_score != _avg_score) {
          if(index < _index) {
            if(avg_score < _avg_score) {
              $(this).parent().find("li").eq(index).insertAfter($(this));
              index = _index
              hasElementMoving = true;
            }
          } else if(index > _index) {
            if(avg_score > _avg_score) {
              $(this).insertAfter($(this).parent().find("li").eq(index));
              index = _index
              hasElementMoving = true;
            }
          }
        } else if(avg_score == _avg_score) {
          if(name != _name) {
            if(index < _index) {
              for (i = 0; i <= max_length; i++){
                if(name.charCodeAt(i) > _name.charCodeAt(i)) {
                  $(this).parent().find("li").eq(index).insertAfter($(this));
                  index = _index
                  hasElementMoving = true;
                  break;
                } else if (name.charCodeAt(i) < _name.charCodeAt(i)) {
                  break;
                }
              }
            } else if(index > _index) {
              for (i = 0; i <= max_length; i++){
                if(name.charCodeAt(i) < _name.charCodeAt(i)) {
                  $(this).insertAfter($(this).parent().find("li").eq(index));
                  index = _index
                  hasElementMoving = true;
                  break;
                } else if (name.charCodeAt(i) > _name.charCodeAt(i)) {
                  break;
                }
              }
            }
          }
        }
      })
    })

    if(hasElementMoving) {
      completed_filter = false
    } else {
      completed_filter = true
    }

    hasElementMoving = false
  }

}

function on_click_settings_menu() {

}

function on_click_assignment(opt, id) {
  switch (opt) {
    case 1:
      $('#'+id).is(':checked') == true ? $('#'+id).prop('checked', false) : $('#'+id).prop('checked', true)

      break;
    default:
  }
}

function pad ( val ) { return val > 9 ? val : "0" + val; }
