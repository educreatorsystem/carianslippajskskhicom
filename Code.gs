/**
 * Backend Apps Script - Deploy: Web app > Execute as Me > Anyone.
 * Set Script Property: PAJSK_FOLDER_ID = ID folder Drive PRIVATE berisi PDF individu.
 * Namakan fail 12-digit-IC.pdf atau 12-digit-IC_2025-2026.pdf
 * Jangan letakkan PDF murid dalam GitHub atau kongsi folder kepada umum.
 */
const PROP_FOLDER = 'PAJSK_FOLDER_ID';
function doGet(e) {
  const q = (e && e.parameter) || {};
  const callback = String(q.callback || '');
  // Permit strictly safe callback identifiers only: prevents script injection.
  if (!/^pajskCallback_[0-9]+_[0-9]+$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback').setMimeType(ContentService.MimeType.TEXT);
  }
  let reply;
  try {
    if(q.action !== 'find') throw Error('Permintaan tidak sah.');
    const ic=String(q.ic || '');
    if(!/^\d{12}$/.test(ic)) throw Error('Nombor MyKad tidak sah.');
    const folderId=PropertiesService.getScriptProperties().getProperty(PROP_FOLDER);
    if(!folderId) throw Error('Pentadbir belum menetapkan folder Google Drive.');
    // Rate limit approximately per IC (not a replacement for strong authentication).
    const cache=CacheService.getScriptCache(),key='attempt_'+ic;
    const attempts=Number(cache.get(key)||0);
    if(attempts>=12) throw Error('Terlalu banyak carian. Cuba selepas 10 minit.');
    cache.put(key,String(attempts+1),600);
    const iter=DriveApp.getFolderById(folderId).getFiles();let file=null,latest=0;
    while(iter.hasNext()) {
      const f=iter.next(),name=f.getName();
      if(!new RegExp('^'+ic+'(?:[_-][a-zA-Z0-9_-]+)?\\.pdf$','i').test(name))continue;
      const edited=f.getLastUpdated().getTime();if(edited>=latest){latest=edited;file=f}
    }
    if(!file){reply={ok:false,message:'Tiada slip ditemui untuk nombor MyKad ini. Sila hubungi pihak sekolah.'};}
    else{const blob=file.getBlob(); if(blob.getBytes().length>7*1024*1024) throw Error('Saiz slip terlalu besar. Hubungi pihak sekolah.');reply={ok:true,pdf:Utilities.base64Encode(blob.getBytes())}}
  } catch(err){reply={ok:false,message:String(err.message||err)}}
  return ContentService.createTextOutput(callback+'('+JSON.stringify(reply)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
