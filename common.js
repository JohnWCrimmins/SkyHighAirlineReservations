var loggedIn = false,
    Username;

var unexpectedError = "An unexpected error occured. If you keep seeing this message, please reload the page or contact technical support.",
    connectionError = "Could not connect. Please check your internet connection or try reloading the page.";

var DomesticInt = 1,
    InternationalInt = 2,
    EconomicInt = 1,
    BusinessInt = 2;
    
/*
Description: Changes the current view
Input: Class of the view to change to
Output: None
*/
function changeView( viewClass ) {
    $.when(
        // Hide any currently active views
        $('.View.Active').fadeOut()
                         .removeClass('Active')
    ).then( function() {
        // Show the view being switched to
        $('.View.' + viewClass ).fadeIn()
                         .addClass('Active');
    });
}

/*
Description: Updates the dashboard to reflect the current login state.
Input: None
Output: None
*/
function updateDashboard() {
    if(loggedIn){
        $('#HeaderUser').text(Username);
        $('.Dashboard').addClass('Loggedin');
    } else {
        $('.Dashboard').removeClass('Loggedin');
    }
    
    // Enable/Disable buttons based on login state
    $('.Dashboard > button.LoginRequired').addClass('locked').prop("disabled",true);
    $('.Loggedin > button.LoginRequired').removeClass('locked').prop("disabled",false);
}

function login() {
    var user = $('#loginUser')[0].value;
    var pass = $('#loginPass')[0].value;
    
    if( (user.length < 1) || (pass.length < 1) ){
        alert('Please enter both a Username and a Password.');
        return;
    }
        
    $.post( "login.php", { user: user, pass: pass }, function( response ) {
        try {
            response = jQuery.parseJSON(response);
        } catch(e) {
            response = {};
        }
        
        if(response.error){
            alert(response.error);
        } else if(response.success){
            loggedIn = true;
            Username = user;
            updateDashboard();
            changeView('Dashboard');
        } else {
            alert(unexpectedError);
        }
    })
    .fail(function(){
        alert(connectionError);
    });
}

function register() {
    var user = $('#registerUser')[0].value;
    var pass1 = $('#registerPass1')[0].value;
    var pass2 = $('#registerPass2')[0].value;
    
    if( (user.length < 1) || (pass1.length < 1) || (pass2.length < 1) ){
        alert('Please enter your desired Username and the Password twice.');
        return;
    }
    
    if(pass1 != pass2) {
        alert('The passwords do not match. Please reenter them.');
        return;
    }
    
    $.post( "register.php", { user: user, pass: pass1 }, function( response ) {
        try {
            response = jQuery.parseJSON(response);
        } catch(e) {
            response = {};
        }
        
        if(response.error){
            alert(response.error);
        } else if(response.success){
            alert('You are now registered. You will now be returned to the dashboard where you can login.');
            changeView('Dashboard');
        } else {
            alert(unexpectedError);
        }
    })
    .fail(function(){
        alert(connectionError);
    });
}

function logout() {
    if(!confirm('Are you sure you want to logout?')){
        return;
    }
    
    loggedIn = false;
    Username = '';
    document.cookie = encodeURIComponent('user') + "=deleted; expires=" + new Date(0).toUTCString();
    document.cookie = encodeURIComponent('pass') + "=deleted; expires=" + new Date(0).toUTCString();
    window.location.reload()
}

function getRates() {
    var classInt, typeInt;
    
    var table = $('.RatesTable')[0];
    
    if($('#ratesDomestic')[0].checked){
        classInt = DomesticInt;
    } else if($('#ratesInternational')[0].checked){
        classInt = InternationalInt;
    } else {
        return;
    }
    
    if($('#ratesEconomic')[0].checked){
        typeInt = EconomicInt;
    } else if($('#ratesBusiness')[0].checked){
        typeInt = BusinessInt;
    } else {
        return;
    }
    
    $.get( "getRates.php", { class: classInt, type: typeInt } )
        .done(function( response ) {
            try {
                response = jQuery.parseJSON(response);
            } catch(e) {
                alert(unexpectedError);
                return;
            }
            
            if(response.error){
                alert(response.error);
            } else {
                // Clear the table
                while(table.rows.length > 1){
                    table.deleteRow(1);
                }
                
                // Add a row to the table for each object in the response
                for(i=1; i<=response.length; i++){
                    table.insertRow(i);
                    for(j=0; j<4; j++) { table.rows[i].insertCell(j); }
                    table.rows[i].cells[0].innerHTML = response[i-1]['From'];
                    table.rows[i].cells[1].innerHTML = response[i-1]['To'];
                    table.rows[i].cells[2].innerHTML = response[i-1]['Price'];
                    table.rows[i].cells[3].innerHTML = response[i-1]['Time'];
                }
            }
        })
        .fail(function(){
            alert(connectionError);
        });

}

function findFlight() {
    var classInt, typeInt;
    var table = $('.RatesTable')[0];
    
	var date = $("#bookDate").val();
	var numAdults = $("#bookAdults").val();
	var numChildren = $("#bookChildren").val();
	var numInfants = $("#bookInfants").val();
	var destination = $("#bookTo").val();
	var origin = $("#bookFrom").val();
	
    if($('#bookDomestic')[0].checked){
        classInt = DomesticInt;
    } else if($('#bookInternational')[0].checked){
        classInt = InternationalInt;
    } else {
        return;
    }
    
    if($('#bookEconomic')[0].checked){
        typeInt = EconomicInt;
    } else if($('#bookBusiness')[0].checked){
        typeInt = BusinessInt;
    } else {
        return;
    }
	
	
}