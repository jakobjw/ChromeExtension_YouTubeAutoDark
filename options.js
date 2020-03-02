// Saves options to chrome.storage
function save_options() {
  var time_dark_begin = document.getElementById("time_dark_begin").value;
  var time_dark_end = document.getElementById("time_dark_end").value;

  chrome.storage.sync.set({
    time_dark_begin: time_dark_begin,
    time_dark_end: time_dark_end
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(function() {
      status.textContent = "";
    }, 750);
  });
}

// Restores state using the preferences stored in chrome.storage.
function restore_options() {
  // default values "18:00" and "07:00"
  chrome.storage.sync.get({
    time_dark_begin: "18:00",
    time_dark_end: "07:00"
  }, function(items) {
    document.getElementById("time_dark_begin").value = items.time_dark_begin;
    document.getElementById("time_dark_end").value = items.time_dark_end;
  });
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click",
    save_options);

//restore_options();