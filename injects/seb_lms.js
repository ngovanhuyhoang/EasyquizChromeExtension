console.log('seb_lms');

// https://fpl2.poly.edu.vn/ilias.php?ref_id=730788&cmdClass=ilrepositorygui&cmdNode=4t&baseClass=ilrepositorygui
// https://fpl2.poly.edu.vn/ilias.php?cmdClass=ilpersonalprofilegui&cmdNode=cl:7&baseClass=ilDashboardGUI

// if (chrome.runtime == undefined) {
//   console.log('chrome.runtime == undefined reload');
//   window.location.reload();
// }
// else {
//   document.addEventListener('click', function(event) {
//     const linkElement = event.target.closest('a');
//     let url = ''
  
//     if (linkElement) {
//       event.preventDefault();
  
//       let clickedUrl = linkElement.href;
//       console.debug('clickedUrl', clickedUrl);
  
      
//       if (clickedUrl.includes('cmd=jumpToProfile')) {
//         url = window.location.origin + '/ilias.php?cmdClass=ilpersonalprofilegui&cmdNode=cl:7&baseClass=ilDashboardGUI';
//       }
//       else if (clickedUrl.includes('cmd=jumpToMemberships')) {
//         url = window.location.origin + '/ilias.php?baseClass=ilDashboardGUI&cmd=jumpToSelectedItems';
//       }
//       else if (clickedUrl.includes('poly.edu.vn/ilias.php')) {
//         url = clickedUrl;
//       }
//       if (url) {
//         chrome.runtime.sendMessage({ type: "update_seb_url", url }, (()=> {
//           window.location.href = url;
//         }));
//       }
//       else {
//         window.location.href = clickedUrl;
//       }
//     }
//   });
  
//   if (window.location.href.includes('login.php')) {
//     chrome.runtime.sendMessage({ 
//       type: "update_seb_url",
//       url: window.location.origin + '/ilias.php?lang=en&client_id=fpolyhn&cmd=post&cmdClass=ilstartupgui&cmdNode=af&baseClass=ilStartUpGUI&rtoken=' 
//     });
//   }
// }