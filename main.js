// Copyright 2020 jakob.j.w@gmail.com

(function() {
 
 time_begin_hours = 18;
 time_begin_mins = 0;
 time_end_hours = 7;
 time_end_mins = 0;
 
 function get_user_options(){
  chrome.storage.sync.get({
    time_dark_begin: "18:00",
    time_dark_end: "07:00"
  }, function(items) {
    begin_splits = items.time_dark_begin.split(":");
    end_splits = items.time_dark_end.split(":");
    time_begin_hours = begin_splits[0];
    time_begin_mins = begin_splits[1];
    time_end_hours = end_splits[0];
    time_end_mins = end_splits[1];
    console.log("YouTube AutoDark: time_begin:   " + time_begin_hours + ":" + time_begin_mins);
    console.log("YouTube AutoDark: time_end:     " + time_end_hours + ":" + time_end_mins);
  });
 }
 
 
 function check_current_time_dark_desired(){
  now = new Date();

  time_begin = new Date();
  time_begin.setHours(time_begin_hours);
  time_begin.setMinutes(time_begin_mins);

  time_end = new Date();
  time_end.setHours(time_end_hours);
  time_end.setMinutes(time_end_mins);

  if(time_begin > time_end){
   // time range encompasses midnight ==> swap begin and end and check if we are NOT within time range
   console.log("YouTube AutoDark: IN MIDNIGHT ENCOMPASS CASE: !((now < time_begin) && (now >= time_end)): " + (!((now < time_begin) && (now >= time_end))));
   return !((now < time_begin) && (now >= time_end));
  }

  else{
    console.log("YouTube AutoDark: without midnight encompass: (now >= time_begin) && (now < time_end): " + ((now >= time_begin) && (now < time_end)));
    return (now >= time_begin) && (now < time_end);
  }

 }
 

 function get_dark_mode(){
  return document.getElementsByTagName("html")[0].getAttribute("dark") == "true";
 }
 
 function get_cookie_value(cookie_name) {
  var matches = document.cookie.match('(^|[^;]+)\\s*' + cookie_name + '\\s*=\\s*([^;]+)');
  return matches ? matches.pop() : "";
 }

 function set_dark_mode(dark_on){ // dark_on = true/false
  pref_cookie_value = get_cookie_value("PREF");
  console.log("YouTube AutoDark: pref_cookie_value: " + pref_cookie_value);
  if(dark_on){
   document.getElementsByTagName("html")[0].setAttribute("dark", "true");
   new_pref_cookie_value = pref_cookie_value.replace("f6=80000", "f6=400");
   document.cookie = "PREF=" + new_pref_cookie_value + ";domain=.youtube.com;max-age=31536000";
  } else{
   document.getElementsByTagName("html")[0].removeAttribute("dark");
   new_pref_cookie_value = pref_cookie_value.replace("f6=400", "f6=80000");
   document.cookie = "PREF=" + new_pref_cookie_value + ";domain=.youtube.com;max-age=31536000";
  }
  pref_cookie_value = get_cookie_value("PREF");
  console.log("YouTube AutoDark: pref_cookie_value: " + pref_cookie_value);
 }

 
 function check_and_maybe_act(){
   dark_desired = check_current_time_dark_desired();
   console.log("YouTube AutoDark: dark_desired: " + dark_desired);
   dark_enabled = get_dark_mode();
   console.log("YouTube AutoDark: dark_enabled: " + dark_enabled);
   if(dark_desired != dark_enabled){
    console.log("YouTube AutoDark: setting dark mode to: " + dark_desired);
    set_dark_mode(dark_desired);
   }
 }
 
 
 setTimeout( function(){
  get_user_options();
 }, 1000*1);
  
 setTimeout( function(){
  check_and_maybe_act();
 }, 1000*5);
 
 setInterval( function(){
  get_user_options();
  check_and_maybe_act();
 }, 1000*10); // every 10 seconds
 

})();
