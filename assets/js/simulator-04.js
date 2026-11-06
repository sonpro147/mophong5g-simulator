
/* ===== Bản tin chuẩn dạng pcap cho thẻ VoLTE: lõi mã hoá (Ethernet, IP, UDP, SCTP, SIP, SDP, Diameter, GTPv2-C, RTP) ===== */
(function(){
if(window.__PCAP)return;
var enc=new TextEncoder();
function cat(){var n=0,i,a=arguments;for(i=0;i<a.length;i++)n+=a[i].length;var o=new Uint8Array(n),p=0;for(i=0;i<a.length;i++){o.set(a[i],p);p+=a[i].length;}return o;}
function be(v,n){var o=new Uint8Array(n);for(var i=n-1;i>=0;i--){o[i]=v%256;v=Math.floor(v/256);}return o;}
function by(a){return Uint8Array.from(a);}
function str(s){return enc.encode(s);}
function ip4(s){return Uint8Array.from(s.split('.').map(Number));}
function ip6(s){var p=s.split('::'),h=p[0]?p[0].split(':'):[],t=(p.length>1&&p[1])?p[1].split(':'):[],mid=8-h.length-t.length,a=h.slice(),i;if(p.length>1)for(i=0;i<mid;i++)a.push('0');a=a.concat(t);var o=[];a.forEach(function(x){var v=parseInt(x||'0',16);o.push(v>>8,v&255);});return Uint8Array.from(o);}
function isV6(s){return s.indexOf(':')>=0;}
function ipb(s){return isV6(s)?ip6(s):ip4(s);}
function cks(b){var s=0,i;for(i=0;i+1<b.length;i+=2)s+=(b[i]<<8)|b[i+1];if(b.length&1)s+=b[b.length-1]<<8;while(s>>>16)s=(s&0xffff)+(s>>>16);return(~s)&0xffff;}
function mac(s){var n=0,i;for(i=0;i<s.length;i++)n=(n*31+s.charCodeAt(i))>>>0;return by([0x02,0x00,(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]);}
/* CRC32c cho SCTP */
var CT=null;function crc32c(b){if(!CT){CT=new Uint32Array(256);for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=(c&1)?(0x82F63B78^(c>>>1)):(c>>>1);CT[n]=c>>>0;}}var c2=0xFFFFFFFF;for(var i=0;i<b.length;i++)c2=CT[(c2^b[i])&255]^(c2>>>8);return(~c2)>>>0;}
function udp(src,dst,sp,dp,pl){var len=8+pl.length,h=cat(be(sp,2),be(dp,2),be(len,2),be(0,2)),v6=isV6(src),ps=v6?cat(ip6(src),ip6(dst),be(len,4),by([0,0,0,17])):cat(ip4(src),ip4(dst),by([0,17]),be(len,2)),c=cks(cat(ps,h,pl));if(c===0)c=0xffff;h[6]=c>>8;h[7]=c&255;return cat(h,pl);}
function sctp(sp,dp,tag,tsn,ppid,pl,sseq){var padn=(4-(pl.length%4))%4,L=16+pl.length,ch=cat(by([0,3]),be(L,2),be(tsn,4),be(0,2),be(sseq||0,2),be(ppid,4),pl,new Uint8Array(padn)),h=cat(be(sp,2),be(dp,2),be(tag,4),be(0,4)),pk=cat(h,ch),c=crc32c(pk);pk[8]=c&255;pk[9]=(c>>>8)&255;pk[10]=(c>>>16)&255;pk[11]=(c>>>24)&255;return pk;}
var IPID=0x1c00;
function ipPkt(src,dst,proto,pl){
  if(isV6(src))return{et:0x86dd,b:cat(by([0x60,0,0,0]),be(pl.length,2),by([proto,64]),ip6(src),ip6(dst),pl)};
  var h=cat(by([0x45,0]),be(20+pl.length,2),be(IPID++&0xffff,2),by([0x40,0,64,proto,0,0]),ip4(src),ip4(dst)),c=cks(h);h[10]=c>>8;h[11]=c&255;return{et:0x0800,b:cat(h,pl)};
}
function frame(src,dst,proto,l4,macs){var ip=ipPkt(src,dst,proto,l4);return cat(mac(macs[1]),mac(macs[0]),be(ip.et,2),ip.b);}
/* ----- hex dump kiểu Wireshark ----- */
function hexdump(b){var o=[],i,j;for(i=0;i<b.length;i+=16){var hx='',as='';for(j=0;j<16;j++){if(i+j<b.length){var v=b[i+j];hx+=(v<16?'0':'')+v.toString(16)+' ';as+=(v>=32&&v<127)?String.fromCharCode(v):'.';}else hx+='   ';if(j===7)hx+=' ';}var off=i.toString(16);while(off.length<4)off='0'+off;o.push(off+'  '+hx+' '+as);}return o.join('\n');}
/* ----- SIP, SDP ----- */
function sipText(o){
  var l=[o.req?o.req+' '+o.ruri+' SIP/2.0':'SIP/2.0 '+o.st[0]+' '+o.st[1]];
  o.h.forEach(function(x){l.push(x[0]+': '+x[1]);});
  var body=o.body?o.body.join('\r\n')+'\r\n':'';
  if(body){l.push('Content-Type: '+(o.ct||'application/sdp'));l.push('Content-Length: '+enc.encode(body).length);}else l.push('Content-Length: 0');
  return l.join('\r\n')+'\r\n\r\n'+body;
}
/* ----- Diameter ----- */
var AVP={
 'Session-Id':[263,0,'U8'],'Origin-Host':[264,0,'U8'],'Origin-Realm':[296,0,'U8'],'Destination-Host':[293,0,'U8'],'Destination-Realm':[283,0,'U8'],'Result-Code':[268,0,'U32'],'Auth-Application-Id':[258,0,'U32'],'Vendor-Id':[266,0,'U32'],'Auth-Session-State':[277,0,'U32'],'User-Name':[1,0,'U8'],'Re-Auth-Request-Type':[285,0,'U32'],'Termination-Cause':[295,0,'U32'],'Experimental-Result':[297,0,'G'],'Experimental-Result-Code':[298,0,'U32'],'Vendor-Specific-Application-Id':[260,0,'G'],'CC-Request-Type':[416,0,'U32'],'CC-Request-Number':[415,0,'U32'],'Subscription-Id':[443,0,'G'],'Subscription-Id-Type':[450,0,'U32'],'Subscription-Id-Data':[444,0,'U8'],'Framed-IP-Address':[8,0,'OS'],'Framed-IPv6-Prefix':[97,0,'OS'],'Called-Station-Id':[30,0,'U8'],'Abort-Cause':[500,1,'U32'],
 'Supported-Features':[628,1,'G'],'Feature-List-ID':[629,1,'U32'],'Feature-List':[630,1,'U32'],'3GPP-User-Location-Info':[22,1,'OS'],'IP-CAN-Type':[1027,1,'U32'],'RAT-Type':[1032,1,'U32'],'Default-EPS-Bearer-QoS':[1049,1,'G'],'QoS-Class-Identifier':[1028,1,'U32'],'Allocation-Retention-Priority':[1034,1,'G'],'Priority-Level':[1046,1,'U32'],'Pre-emption-Capability':[1047,1,'U32'],'Pre-emption-Vulnerability':[1048,1,'U32'],'APN-Aggregate-Max-Bitrate-UL':[1041,1,'U32'],'APN-Aggregate-Max-Bitrate-DL':[1040,1,'U32'],'Event-Trigger':[1006,1,'U32'],'Charging-Rule-Install':[1001,1,'G'],'Charging-Rule-Remove':[1002,1,'G'],'Charging-Rule-Definition':[1003,1,'G'],'Charging-Rule-Name':[1005,1,'OS'],'Flow-Information':[1058,1,'G'],'Flow-Description':[507,1,'OS'],'Flow-Direction':[1080,1,'U32'],'QoS-Information':[1016,1,'G'],'Max-Requested-Bandwidth-UL':[516,1,'U32'],'Max-Requested-Bandwidth-DL':[515,1,'U32'],'Guaranteed-Bitrate-UL':[1026,1,'U32'],'Guaranteed-Bitrate-DL':[1025,1,'U32'],'Precedence':[1010,1,'U32'],'Online':[1009,1,'U32'],'Offline':[1008,1,'U32'],'Bearer-Identifier':[1020,1,'OS'],'Bearer-Usage':[1000,1,'U32'],'Access-Network-Charging-Identifier-Gx':[1022,1,'G'],'Access-Network-Charging-Identifier-Value':[503,1,'OS'],
 'Media-Component-Description':[517,1,'G'],'Media-Component-Number':[518,1,'U32'],'Media-Sub-Component':[519,1,'G'],'Flow-Number':[509,1,'U32'],'Flow-Usage':[512,1,'U32'],'Media-Type':[520,1,'U32'],'Flow-Status':[511,1,'U32'],'Specific-Action':[513,1,'U32'],'AF-Application-Identifier':[504,1,'OS'],'AF-Charging-Identifier':[505,1,'OS'],'Reservation-Priority':[458,1,'U32'],'Service-URN':[525,1,'OS'],'AF-Signalling-Protocol':[529,1,'U32'],'Rx-Request-Type':[533,1,'U32'],'RR-Bandwidth':[521,1,'U32'],'RS-Bandwidth':[522,1,'U32'],'Codec-Data':[524,1,'OS'],
 'Visited-PLMN-Id':[1407,1,'OS'],'Requested-EUTRAN-Authentication-Info':[1408,1,'G'],'Number-Of-Requested-Vectors':[1410,1,'U32'],'Immediate-Response-Preferred':[1412,1,'U32'],'Authentication-Info':[1413,1,'G'],'E-UTRAN-Vector':[1414,1,'G'],'RAND':[1447,1,'OS'],'XRES':[1448,1,'OS'],'AUTN':[1449,1,'OS'],'KASME':[1450,1,'OS'],'ULR-Flags':[1405,1,'U32'],'ULA-Flags':[1406,1,'U32'],'Subscription-Data':[1400,1,'G'],'Subscriber-Status':[1424,1,'U32'],'Network-Access-Mode':[1417,1,'U32'],'AMBR':[1435,1,'G'],'Max-Requested-Bandwidth-UL-S6a':[516,1,'U32'],'APN-Configuration-Profile':[1429,1,'G'],'Context-Identifier':[1423,1,'U32'],'All-APN-Configurations-Included-Indicator':[1428,1,'U32'],'APN-Configuration':[1430,1,'G'],'Service-Selection':[493,0,'U8'],'PDN-Type':[1456,1,'U32'],'EPS-Subscribed-QoS-Profile':[1431,1,'G'],'UE-SRVCC-Capability':[1615,1,'U32'],'MSISDN':[701,1,'OS'],
 'Public-Identity':[601,1,'U8'],'Visited-Network-Identifier':[600,1,'OS'],'Server-Name':[602,1,'U8'],'SIP-Auth-Data-Item':[612,1,'G'],'SIP-Authentication-Scheme':[608,1,'U8'],'SIP-Number-Auth-Items':[607,1,'U32'],'SIP-Authenticate':[609,1,'OS'],'SIP-Authorization':[610,1,'OS'],'Confidentiality-Key':[625,1,'OS'],'Integrity-Key':[626,1,'OS'],'User-Authorization-Type':[623,1,'U32'],'User-Data':[606,1,'OS'],'Server-Assignment-Type':[614,1,'U32'],'Server-Capabilities':[603,1,'G'],'Mandatory-Capability':[604,1,'U32'],'Originating-Request':[633,1,'U32'],'SIP-Item-Number':[613,1,'U32'],'Charging-Information':[618,1,'G'],'Primary-Charging-Collection-Function-Name':[621,1,'U8'],'Primary-Event-Charging-Function-Name':[619,1,'U8']
};
var DAPP={Gx:16777238,Rx:16777236,S6a:16777251,Cx:16777216,Gy:4};
var DCMD={CC:272,RA:258,AA:265,ST:275,AS:274,AI:318,UL:316,UA:300,MA:303,SA:301,LI:302};
var DCMDN={272:'Credit-Control',258:'Re-Auth',265:'AA',275:'Session-Termination',274:'Abort-Session',318:'Authentication-Information',316:'Update-Location',300:'User-Authorization',303:'Multimedia-Auth',301:'Server-Assignment',302:'Location-Info'};
function avpEnc(a){
  var d=AVP[a[0]];if(!d)throw new Error('AVP '+a[0]);
  var v=a[1],data;
  if(d[2]==='G')data=cat.apply(null,v.map(avpEnc));
  else if(d[2]==='U32')data=be(v,4);
  else if(d[2]==='U8')data=str(v);
  else data=(v instanceof Uint8Array)?v:str(String(v));
  var hd=d[1]?12:8,len=hd+data.length,padn=(4-(len%4))%4,fl=(d[1]?0x80:0)|0x40;
  return cat(be(d[0],4),by([fl]),be(len,3),d[1]?be(10415,4):new Uint8Array(0),data,new Uint8Array(padn));
}
function diaEnc(o){ /* o:{cmd,app,req,hh,ee,avps} */
  var body=cat.apply(null,o.avps.map(avpEnc)),L=20+body.length;
  return cat(by([1]),be(L,3),by([o.req?0xc0:0x40]),be(o.cmd,3),be(o.app,4),be(o.hh,4),be(o.ee,4),body);
}
/* ----- GTPv2-C ----- */
var GIE={IMSI:1,Cause:2,APN:71,AMBR:72,EBI:73,MEI:75,MSISDN:76,Indication:77,PCO:78,PAA:79,BearerQoS:80,RAT:82,ServingNet:83,TFT:84,ULI:86,FTEID:87,BearerContext:93,PDNType:99,SelMode:128,APNRes:127,ChargingChar:95,Delay:92,PTI:100,UETimeZone:114,ChargingId:94};
function tbcd(s){var o=[],i;for(i=0;i<s.length;i+=2){var a=+s[i],b=i+1<s.length?+s[i+1]:15;o.push((b<<4)|a);}return by(o);}
function plmn(mcc,mnc){var m=String(mcc),n=String(mnc);if(n.length===2)n=n+'f';var d=function(c){return c==='f'?15:+c;};return by([(d(m[1])<<4)|d(m[0]),(d(n[2])<<4)|d(m[2]),(d(n[1])<<4)|d(n[0])]);}
function gie(type,inst,val){return cat(by([type]),be(val.length,2),by([inst&15]),val);}
function gtpEnc(o){ /* o:{type,teid,seq,ies:[[type,inst,bytes]]} */
  var body=cat.apply(null,o.ies.map(function(x){return gie(x[0],x[1],x[2]);})),ln=4+4+body.length-0; /* sau 4 byte đầu: TEID(4)+seq(3)+spare(1)+body */
  return cat(by([0x48,o.type]),be(4+4+body.length,2),be(o.teid,4),be(o.seq,3),by([0]),body);
}
function bqos(qci,pl,pci,pvi,mu,md,gu,gd){function k5(v){return be(v,5);}return cat(by([((pci?1:0)<<6)|(pl<<2)|(pvi?1:0),qci]),k5(mu),k5(md),k5(gu),k5(gd));}
function apnEnc(s){return cat.apply(null,s.split('.').map(function(p){return cat(by([p.length]),str(p));}));}
/* ----- RTP, RTCP ----- */
function rtp(pt,seq,ts,ssrc,pl,mark){return cat(by([0x80,(mark?0x80:0)|pt]),be(seq,2),be(ts,4),be(ssrc,4),pl);}
function rtcpSR(ssrc,ntpH,ntpL,rts,pk,oc,rb){ /* SR kèm một khối báo cáo */
  var sr=cat(by([0x81,200]),be(12,2),be(ssrc,4),be(ntpH,4),be(ntpL,4),be(rts,4),be(pk,4),be(oc,4),be(rb.ssrc,4),by([rb.frac]),be(rb.lost,3),be(rb.ext,4),be(rb.jit,4),be(0,4),be(0,4));
  var sd=cat(by([0x81,202]),be(3,2),be(ssrc,4),by([1,6]),str('ue-a@x'.slice(0,6)),by([0,0]));
  return cat(sr,sd);
}
window.__PCAP={cat:cat,be:be,by:by,str:str,ip4:ip4,ip6:ip6,udp:udp,sctp:sctp,frame:frame,hexdump:hexdump,sipText:sipText,AVP:AVP,DAPP:DAPP,DCMDN:DCMDN,avpEnc:avpEnc,diaEnc:diaEnc,gtpEnc:gtpEnc,gie:gie,GIE:GIE,tbcd:tbcd,plmn:plmn,bqos:bqos,apnEnc:apnEnc,rtp:rtp,rtcpSR:rtcpSR,crc32c:crc32c,cks:cks,isV6:isV6,ipb:ipb};
})();

/* ===== Thư viện bản tin (1): nút mạng, SIP, SDP ===== */
(function(){
var P=window.__PCAP;if(!P||P.N)return;
var N={
 UEA:{n:'UE A',v6:'2001:db8:a::1',v4:'100.64.0.1'},UEB:{n:'UE B',v6:'2001:db8:b::1',v4:'100.64.0.2'},
 ENB1:{n:'eNB A',v4:'10.20.1.11'},ENB2:{n:'eNB B',v4:'10.20.1.12'},MME:{n:'MME',v4:'10.10.2.21'},
 SGW:{n:'S/P-GW',v4:'10.10.3.31'},PCRF:{n:'PCRF',v4:'10.10.4.41'},HSS:{n:'HSS',v4:'10.10.5.51'},
 PCA:{n:'P-CSCF/SBC A',v4:'10.30.1.61',v6:'2001:db8:5::51'},PCB:{n:'P-CSCF/SBC B',v4:'10.30.2.61',v6:'2001:db8:5::52'},
 SC:{n:'S-CSCF',v4:'10.30.3.71'},SC2:{n:'S-CSCF B',v4:'10.30.3.72'},TA:{n:'TAS A',v4:'10.30.4.81'},TB:{n:'TAS B',v4:'10.30.4.82'},MRF:{n:'MRF',v4:'10.30.5.91'}
};
var NAMEKEY={'UE':'UEA','UE A':'UEA','UE B':'UEB','eNB':'ENB1','eNB A':'ENB1','eNB B':'ENB2','eNB nguồn':'ENB1','eNB đích':'ENB2','MME':'MME','HSS':'HSS','S/P-GW':'SGW','PCRF':'PCRF','P-CSCF':'PCA','SBC A':'PCA','SBC B':'PCB','S-CSCF':'SC','IMS':'SC','CSCF A':'SC','CSCF B':'SC2','TAS A':'TA','TAS B':'TB','Nhạc chờ':'MRF'};
var REALM='ims.mnc099.mcc452.3gppnetwork.org';
var A={ms:'+84901234567',imsi:'452990000012345',ip:N.UEA.v6,tag:'a7c91f3e',cid:'4d8f2b1c90a37e56@2001:db8:a::1'};
var B={ms:'+84907654321',imsi:'452990000054321',ip:N.UEB.v6,tag:'b2e5d84a'};
function uri(p){return 'sip:'+p.ms+'@'+REALM+';user=phone';}
function hash(s){var n=5381,i;for(i=0;i<s.length;i++)n=((n*33)^s.charCodeAt(i))>>>0;return n.toString(16);}
var UAGENT='User-Agent: 3GPP-VoLTE-UE/1.0';
function ipOf(k,fam){var n=N[k];if(fam==='6'){if(n.v6)return n.v6;var q=n.v4.split('.');return '2001:db8:fe::'+(q[2]*256+ +q[3]).toString(16);}return n.v4||n.v6;}
function famOf(a,b){return (a==='UEA'||a==='UEB'||b==='UEA'||b==='UEB')?'6':'4';}
/* ----- SDP ----- */
function sdp(kind){
 var l=[],ipA=A.ip,ipB=B.ip,e=false;
 var mk=function(ip,port,codecs,o){
  l.push('v=0','o=- '+(o||'3924872401')+' '+(o||'3924872401')+' IN IP6 '+ip,'s=-','c=IN IP6 '+ip,'b=AS:'+(kind==='offer'?'49':'41'),'t=0 0','m=audio '+port+' RTP/AVP '+codecs);
 };
 var q=function(loc,rem,des){l.push('a=curr:qos local '+loc,'a=curr:qos remote '+rem,'a=des:qos mandatory local sendrecv','a=des:qos mandatory remote sendrecv');};
 if(kind==='offer'){
  mk(ipA,49120,'104 102 105');
  l.push('b=RS:0','b=RR:2000','a=rtpmap:104 AMR-WB/16000/1','a=fmtp:104 mode-change-capability=2; max-red=0','a=rtpmap:102 AMR/8000/1','a=fmtp:102 mode-change-capability=2; max-red=0','a=rtpmap:105 telephone-event/8000','a=fmtp:105 0-15','a=ptime:20','a=maxptime:240');
  q('none','none');l.push('a=sendrecv');
 }else if(kind==='ans'||kind==='ans2'){
  mk(ipB,50240,'104 105','3924872555');
  l.push('b=RS:0','b=RR:2000','a=rtpmap:104 AMR-WB/16000/1','a=fmtp:104 mode-change-capability=2; max-red=0','a=rtpmap:105 telephone-event/8000','a=fmtp:105 0-15','a=ptime:20','a=maxptime:240');
  if(kind==='ans')q('none','none');else{l.push('a=curr:qos local sendrecv','a=curr:qos remote none','a=des:qos mandatory local sendrecv','a=des:qos mandatory remote sendrecv','a=conf:qos remote sendrecv');}
  l.push('a=sendrecv');
 }else if(kind==='updA'){ /* A báo đã dành xong tài nguyên */
  mk(ipA,49120,'104 105');
  l.push('a=rtpmap:104 AMR-WB/16000/1','a=rtpmap:105 telephone-event/8000','a=ptime:20','a=curr:qos local sendrecv','a=curr:qos remote sendrecv','a=des:qos mandatory local sendrecv','a=des:qos mandatory remote sendrecv','a=sendrecv');
 }else if(kind==='updB'){
  mk(ipB,50240,'104 105','3924872555');
  l.push('a=rtpmap:104 AMR-WB/16000/1','a=rtpmap:105 telephone-event/8000','a=ptime:20','a=curr:qos local sendrecv','a=curr:qos remote sendrecv','a=des:qos mandatory local sendrecv','a=des:qos mandatory remote sendrecv','a=sendrecv');
 }else if(kind==='mrf'){ /* nhạc chờ (CRBT) */
  l.push('v=0','o=mrf 3924880001 3924880001 IN IP4 10.30.5.91','s=-','c=IN IP4 10.30.5.91','t=0 0','m=audio 50500 RTP/AVP 104','a=rtpmap:104 AMR-WB/16000/1','a=ptime:20','a=sendonly');
 }else if(kind==='mrfo'){
  l.push('v=0','o=tas 3924880000 3924880000 IN IP4 10.30.4.81','s=-','c=IN IP4 10.30.5.91','t=0 0','m=audio 0 RTP/AVP 104','a=rtpmap:104 AMR-WB/16000/1','a=recvonly');
 }
 return l;
}
/* ----- SIP: một bản tin ----- */
/* s:{t:'INVITE'|'183'..., cm: method trong CSeq (chỉ với phản hồi), snd:'caller'|'callee', leg:'A'|'B'|'M', src, dst (khoá nút), sdp, x:[[h,v]], cs, pre:true (nhận UE), tag:true} */
function sipMsg(s){
 var resp=/^\d/.test(s.t),m=resp?s.cm:s.t,fam=famOf(s.src,s.dst),sip=ipOf(s.src,fam),dip=ipOf(s.dst,fam);
 var caller=(s.leg==='M')?{ms:'+84900000000',tag:'t4s0a1',ip:ipOf('TA','4')}:A,callee=(s.leg==='M')?{ms:'+84909999999',tag:'m7r5f2'}:B;
 var cid=s.leg==='B'?'8e1b60d3a4f2c795@'+N.SC.v4:s.leg==='M'?'2c9d1e77b05a@'+N.TA.v4:A.cid;
 var fromP=(s.snd==='callee'&&!resp)?callee:caller,toP=(s.snd==='callee'&&!resp)?caller:callee;
 if(resp){fromP=caller;toP=callee;}
 var fT=fromP===caller?caller.tag:callee.tag,tT=toP===callee?callee.tag:caller.tag;
 var inDlg=(['PRACK','UPDATE','ACK','BYE'].indexOf(m)>=0)||(resp&&['PRACK','UPDATE','BYE'].indexOf(m)>=0)||(resp&&m==='INVITE'&&s.t!=='100'&&s.t!=='401');
 var toTag=(inDlg||s.tag)&&!(s.t==='100')&&!(m==='REGISTER'&&!resp);
 var cs=s.cs||({INVITE:1,PRACK:2,UPDATE:3,BYE:4,REGISTER:1}[m]||1);if(m==='ACK')cs=1;
 var h=[],port=(fam==='6'&&(s.src==='UEA'||s.src==='UEB'))?5060:5060;
 var br='z9hG4bK'+hash(cid+m+cs+s.src);
 h.push(['Via','SIP/2.0/UDP '+(fam==='6'?'['+sip+']':sip)+':'+port+';branch='+br+(s.src==='UEA'||s.src==='UEB'?';rport':'')]);
 if(!resp)h.push(['Max-Forwards',s.src==='UEA'||s.src==='UEB'?'70':'67']);
 var url=function(p){return 'sip:'+p.ms+'@'+REALM+';user=phone';};
 h.push(['From','<'+url(fromP)+'>;tag='+fT]);
 h.push(['To','<'+url(toP)+'>'+(toTag?';tag='+tT:'')]);
 h.push(['Call-ID',cid]);
 h.push(['CSeq',cs+' '+m]);
 var ct=function(p,ip){return '<sip:'+p.ms+'@['+ip+']:5060>';};
 var o={h:h};
 if(!resp){
  var tgt=(m==='INVITE'||m==='REGISTER')?(m==='REGISTER'?'sip:'+REALM:url(callee)):(s.snd==='callee'?'sip:'+A.ms+'@['+A.ip+']:5060':'sip:'+B.ms+'@['+B.ip+']:5060');
  o.req=m;o.ruri=tgt;
 }else o.st=[s.t,{100:'Trying',180:'Ringing',183:'Session Progress',200:'OK',401:'Unauthorized',408:'Request Timeout',487:'Request Terminated'}[s.t]||'OK'];
 var ue=(s.src==='UEA'||s.src==='UEB'),ia=h.length;
 var R=s.t==='INVITE'||s.t==='UPDATE'||s.t==='200'&&(m==='INVITE'||m==='UPDATE');
 if(m==='INVITE'&&!resp){
  h.push(['Contact',ct(s.snd==='callee'?callee:caller,s.snd==='callee'?B.ip:A.ip)+';+g.3gpp.icsi-ref="urn%3Aurn-7%3A3gpp-service.ims.icsi.mmtel";+g.3gpp.smsip'],
   ['Allow','INVITE, ACK, CANCEL, BYE, PRACK, UPDATE, REFER, MESSAGE, OPTIONS'],['Supported','100rel, precondition, timer, histinfo'],['Require','sec-agree'],['Session-Expires','1800;refresher=uac'],['Min-SE','90'],
   ['Accept-Contact','*;+g.3gpp.icsi-ref="urn%3Aurn-7%3A3gpp-service.ims.icsi.mmtel"'],
   [ue?'P-Preferred-Identity':'P-Asserted-Identity','<'+url(caller)+'>'],['P-Access-Network-Info','3GPP-E-UTRAN-FDD; utran-cell-id-3gpp=45299000100011'],['Security-Verify','ipsec-3gpp; q=0.1; alg=hmac-sha-1-96; spi-c=1000; spi-s=2000; port-c=5062; port-s=5063']);
  if(!ue)h.push(['Record-Route','<sip:term@'+REALM.replace('ims','scscf.ims')+';lr>']);
 }else if(m==='INVITE'&&resp){
  if(s.t==='183')h.push(['Require','100rel, precondition'],['RSeq','1'],['Contact',ct(callee,B.ip)],['Allow','INVITE, ACK, CANCEL, BYE, PRACK, UPDATE'],['Supported','timer'],['P-Early-Media','supported']);
  else if(s.t==='180')h.push(['Require','100rel'],['RSeq','2'],['Contact',ct(callee,B.ip)],['Allow','INVITE, ACK, CANCEL, BYE, PRACK, UPDATE']);
  else if(s.t==='200')h.push(['Contact',ct(callee,B.ip)+';+g.3gpp.icsi-ref="urn%3Aurn-7%3A3gpp-service.ims.icsi.mmtel"'],['Allow','INVITE, ACK, CANCEL, BYE, PRACK, UPDATE'],['Session-Expires','1800;refresher=uac'],['Supported','timer']);
  else if(s.t==='408')h.push(['Reason','SIP;cause=408;text="Request Timeout"']);
 }else if(m==='PRACK'&&!resp)h.push(['RAck','1 1 INVITE'],['Contact',ct(caller,A.ip)]);
 else if(m==='UPDATE'&&!resp)h.push(['Contact',ct(s.snd==='callee'?callee:caller,s.snd==='callee'?B.ip:A.ip)],['Supported','timer'],['Session-Expires','1800;refresher=uac']);
 else if(m==='UPDATE'&&resp&&s.t==='200')h.push(['Contact',ct(callee,B.ip)]);
 else if(m==='BYE'&&!resp&&s.reason)h.push(['Reason',s.reason]);
 else if(m==='REGISTER'&&!resp){
  h.push(['Contact','<sip:'+A.ms+'@['+A.ip+']:5060>;+sip.instance="<urn:gsma:imei:35216509-123456-0>";+g.3gpp.icsi-ref="urn%3Aurn-7%3A3gpp-service.ims.icsi.mmtel"'],['Expires','600000'],
   ['Allow','INVITE, ACK, CANCEL, BYE, PRACK, UPDATE, REFER, MESSAGE, OPTIONS'],['Supported','path, gruu, sec-agree'],['Require','sec-agree'],['Proxy-Require','sec-agree'],
   ['Authorization','Digest username="'+A.imsi+'@'+REALM+'",realm="'+REALM+'",nonce="'+(s.auth?'dGhlLW5vbmNlLXZhbHVlLTEyMw==':'')+'",uri="sip:'+REALM+'",response="'+(s.auth?'6629fae49393a05397450978507c4ef1':'')+'",algorithm=AKAv1-MD5'+(s.auth?',qop=auth-int,cnonce="a7d1",nc=00000001':'')],
   ['Security-Client','ipsec-3gpp; alg=hmac-sha-1-96; ealg=aes-cbc; spi-c=1000; spi-s=2000; port-c=5062; port-s=5063'],['P-Access-Network-Info','3GPP-E-UTRAN-FDD; utran-cell-id-3gpp=45299000100011'],['P-Visited-Network-ID',REALM]);
  o.ruri='sip:'+REALM;
 }else if(m==='REGISTER'&&resp&&s.t==='401')h.push(['WWW-Authenticate','Digest realm="'+REALM+'",nonce="dGhlLW5vbmNlLXZhbHVlLTEyMw==",algorithm=AKAv1-MD5,ik="00112233445566778899aabbccddeeff",ck="ffeeddccbbaa99887766554433221100",qop="auth,auth-int"'],['Security-Server','ipsec-3gpp; q=0.1; alg=hmac-sha-1-96; ealg=aes-cbc; spi-c=3000; spi-s=4000; port-c=6062; port-s=6063']);
 else if(m==='REGISTER'&&resp&&s.t==='200')h.push(['Contact','<sip:'+A.ms+'@['+A.ip+']:5060>;expires=600000'],['Path','<sip:term@pcscf.'+REALM+';lr>'],['Service-Route','<sip:orig@scscf.'+REALM+';lr>'],['P-Associated-URI','<sip:'+A.ms+'@'+REALM+'>, <tel:'+A.ms+'>'],['Allow','INVITE, ACK, CANCEL, BYE, PRACK, UPDATE, REFER, MESSAGE, OPTIONS'],['Supported','path, gruu']);
 else if(m==='BYE'&&resp||m==='ACK'&&!resp&&false){}
 if(s.x)s.x.forEach(function(q){h.push(q);});
 var sd=s.sdp?sdp(s.sdp):null;
 if(sd)o.body=sd;
 if(s.t==='200'&&m==='REGISTER'||s.t==='401'||s.t==='408'||m==='BYE'||s.t==='100'){/* không SDP */}
 h.push([ 'User-Agent',s.src==='UEA'||s.src==='UEB'?'3GPP-VoLTE-UE/1.0':'IMS-Core/1.0']);
 o.src=sip;o.dst=dip;o.fam=fam;
 return {text:P.sipText(o),o:o,src:sip,dst:dip,fam:fam,sdp:!!sd};
}
P.N=N;P.NAMEKEY=NAMEKEY;P.sipMsg=sipMsg;P.sdp=sdp;P.ipOf=ipOf;P.famOf=famOf;P.A=A;P.B=B;P.REALM=REALM;
})();

/* ===== Thư viện bản tin (2): Diameter, GTPv2-C, RTP/RTCP + bộ giải mã (dựng cây) ===== */
(function(){
var P=window.__PCAP;if(!P||P.dia)return;
var cat=P.cat,by=P.by,be=P.be,str=P.str,N=P.N;
var EPC='epc.mnc099.mcc452.3gppnetwork.org',IMS=P.REALM;
var H={MME:'mme01.'+EPC,HSS:'hss01.'+EPC,PGW:'pgw01.'+EPC,PCRF:'pcrf01.'+EPC,PCSCF:'pcscf01.'+IMS,SCSCF:'scscf01.'+IMS,TAS:'tas01.'+IMS};
function rb(n,s){var o=[],x=s;for(var i=0;i<n;i++){x=(x*1103515245+12345)>>>0;o.push((x>>>16)&255);}return by(o);}
function sid(h,app,n){return h+';'+(1760000000+app%1000)+';'+n;}
var S6A=P.DAPP.S6a,GX=P.DAPP.Gx,RX=P.DAPP.Rx,CX=P.DAPP.Cx;
function vsa(app){return ['Vendor-Specific-Application-Id',[['Vendor-Id',10415],['Auth-Application-Id',app]]];}
function arp(pl,pc,pv){return ['Allocation-Retention-Priority',[['Priority-Level',pl],['Pre-emption-Capability',pc],['Pre-emption-Vulnerability',pv]]];}
var imsi=P.A.imsi;
var D={
 'AIR':[S6A,318,1,function(){return [['Session-Id',sid(H.MME,S6A,1)],vsa(S6A),['Auth-Session-State',1],['Origin-Host',H.MME],['Origin-Realm',EPC],['Destination-Realm',EPC],['User-Name',imsi],['Requested-EUTRAN-Authentication-Info',[['Number-Of-Requested-Vectors',1],['Immediate-Response-Preferred',0]]],['Visited-PLMN-Id',P.plmn('452','99')]];}],
 'AIA':[S6A,318,0,function(){return [['Session-Id',sid(H.MME,S6A,1)],vsa(S6A),['Result-Code',2001],['Auth-Session-State',1],['Origin-Host',H.HSS],['Origin-Realm',EPC],['Authentication-Info',[['E-UTRAN-Vector',[['RAND',rb(16,1)],['XRES',rb(8,2)],['AUTN',rb(16,3)],['KASME',rb(32,4)]]]]]];}],
 'ULR':[S6A,316,1,function(){return [['Session-Id',sid(H.MME,S6A,2)],vsa(S6A),['Auth-Session-State',1],['Origin-Host',H.MME],['Origin-Realm',EPC],['Destination-Realm',EPC],['User-Name',imsi],['RAT-Type',1004],['ULR-Flags',34],['Visited-PLMN-Id',P.plmn('452','99')]];}],
 'ULA':[S6A,316,0,function(){return [['Session-Id',sid(H.MME,S6A,2)],vsa(S6A),['Result-Code',2001],['Auth-Session-State',1],['Origin-Host',H.HSS],['Origin-Realm',EPC],['ULA-Flags',1],['Subscription-Data',[['Subscriber-Status',0],['Network-Access-Mode',0],['AMBR',[['Max-Requested-Bandwidth-UL',50000000],['Max-Requested-Bandwidth-DL',100000000]]],['APN-Configuration-Profile',[['Context-Identifier',1],['All-APN-Configurations-Included-Indicator',0],['APN-Configuration',[['Context-Identifier',1],['PDN-Type',2],['Service-Selection','ims'],['EPS-Subscribed-QoS-Profile',[['QoS-Class-Identifier',5],arp(8,1,0)]]]]]]]]];}],
 'CCR-I':[GX,272,1,function(){return [['Session-Id',sid(H.PGW,GX,3)],['Auth-Application-Id',GX],['Origin-Host',H.PGW],['Origin-Realm',EPC],['Destination-Realm',EPC],['CC-Request-Type',1],['CC-Request-Number',0],['Subscription-Id',[['Subscription-Id-Type',1],['Subscription-Id-Data','84901234567']]],['Subscription-Id',[['Subscription-Id-Type',1],['Subscription-Id-Data',imsi]]],['Framed-IPv6-Prefix',cat(by([0,64]),P.ip6('2001:db8:a::'))],['Called-Station-Id','ims'],['IP-CAN-Type',5],['RAT-Type',1004],['Default-EPS-Bearer-QoS',[['QoS-Class-Identifier',5],arp(8,1,0)]]];}],
 'CCA-I':[GX,272,0,function(){return [['Session-Id',sid(H.PGW,GX,3)],['Auth-Application-Id',GX],['Result-Code',2001],['Origin-Host',H.PCRF],['Origin-Realm',EPC],['CC-Request-Type',1],['CC-Request-Number',0],['Default-EPS-Bearer-QoS',[['QoS-Class-Identifier',5],arp(8,1,0)]],['Event-Trigger',13]];}],
 'GXRAR':[GX,258,1,function(){return [['Session-Id',sid(H.PGW,GX,3)],['Auth-Application-Id',GX],['Origin-Host',H.PCRF],['Origin-Realm',EPC],['Destination-Host',H.PGW],['Destination-Realm',EPC],['Re-Auth-Request-Type',0],['Charging-Rule-Install',[['Charging-Rule-Definition',[['Charging-Rule-Name','VoLTE-QCI1'],['Flow-Information',[['Flow-Description','permit out 17 from 2001:db8:b::1 50240 to 2001:db8:a::1 49120'],['Flow-Direction',1]]],['Flow-Information',[['Flow-Description','permit out 17 from 2001:db8:a::1 49120 to 2001:db8:b::1 50240'],['Flow-Direction',2]]],['QoS-Information',[['QoS-Class-Identifier',1],['Max-Requested-Bandwidth-UL',49000],['Max-Requested-Bandwidth-DL',49000],['Guaranteed-Bitrate-UL',49000],['Guaranteed-Bitrate-DL',49000],arp(2,1,0)]],['Precedence',100]]]]]];}],
 'GXRAR-DEL':[GX,258,1,function(){return [['Session-Id',sid(H.PGW,GX,3)],['Auth-Application-Id',GX],['Origin-Host',H.PCRF],['Origin-Realm',EPC],['Destination-Host',H.PGW],['Destination-Realm',EPC],['Re-Auth-Request-Type',0],['Charging-Rule-Remove',[['Charging-Rule-Name','VoLTE-QCI1']]]];}],
 'GXRAA':[GX,258,0,function(){return [['Session-Id',sid(H.PGW,GX,3)],['Result-Code',2001],['Origin-Host',H.PGW],['Origin-Realm',EPC]];}],
 'AAR':[RX,265,1,function(){return [['Session-Id',sid(H.PCSCF,RX,4)],['Auth-Application-Id',RX],['Origin-Host',H.PCSCF],['Origin-Realm',IMS],['Destination-Realm',EPC],['AF-Application-Identifier','IMS Services'],['Media-Component-Description',[['Media-Component-Number',1],['Media-Sub-Component',[['Flow-Number',1],['Flow-Description','permit out 17 from 2001:db8:b::1 50240 to 2001:db8:a::1 49120'],['Flow-Usage',0]]],['Media-Sub-Component',[['Flow-Number',2],['Flow-Description','permit out 17 from 2001:db8:a::1 49120 to 2001:db8:b::1 50240'],['Flow-Usage',0]]],['Media-Type',0],['Flow-Status',2],['RR-Bandwidth',0],['RS-Bandwidth',0],['Codec-Data','uplink\noffer\nm=audio 49120 RTP/AVP 104 105\na=rtpmap:104 AMR-WB/16000/1']]],['Framed-IPv6-Prefix',cat(by([0,64]),P.ip6('2001:db8:a::'))],['Specific-Action',2],['Service-URN','urn:service:sos'.slice(0,0)+'urn:3gpp:services:mmtel'],['AF-Charging-Identifier','icid-value=1a2b3c4d;orig-ioi='+IMS]].filter(function(x){return x[0]!=='Service-URN';});}],
 'AAA':[RX,265,0,function(){return [['Session-Id',sid(H.PCSCF,RX,4)],['Auth-Application-Id',RX],['Result-Code',2001],['Origin-Host',H.PCRF],['Origin-Realm',EPC],['Access-Network-Charging-Identifier-Gx',[['Access-Network-Charging-Identifier-Value','ggsn-icid-5f3e'],['Flow-Number',1]]]];}],
 'STR':[RX,275,1,function(){return [['Session-Id',sid(H.PCSCF,RX,4)],['Auth-Application-Id',RX],['Origin-Host',H.PCSCF],['Origin-Realm',IMS],['Destination-Realm',EPC],['Termination-Cause',1]];}],
 'STA':[RX,275,0,function(){return [['Session-Id',sid(H.PCSCF,RX,4)],['Result-Code',2001],['Origin-Host',H.PCRF],['Origin-Realm',EPC]];}],
 'ASR':[RX,274,1,function(){return [['Session-Id',sid(H.PCSCF,RX,4)],['Auth-Application-Id',RX],['Origin-Host',H.PCRF],['Origin-Realm',EPC],['Destination-Host',H.PCSCF],['Destination-Realm',IMS],['Abort-Cause',0]];}],
 'ASA':[RX,274,0,function(){return [['Session-Id',sid(H.PCSCF,RX,4)],['Result-Code',2001],['Origin-Host',H.PCSCF],['Origin-Realm',IMS]];}],
 'UAR':[CX,300,1,function(){return [['Session-Id',sid(H.PCSCF,CX,5)],vsa(CX),['Auth-Session-State',1],['Origin-Host','icscf01.'+IMS],['Origin-Realm',IMS],['Destination-Realm',IMS],['User-Name','sip:'+imsi+'@'+IMS],['Public-Identity','sip:+84901234567@'+IMS],['Visited-Network-Identifier',str(IMS)],['User-Authorization-Type',0]];}],
 'UAA':[CX,300,0,function(){return [['Session-Id',sid(H.PCSCF,CX,5)],vsa(CX),['Result-Code',2001],['Auth-Session-State',1],['Origin-Host',H.HSS],['Origin-Realm',EPC],['Server-Name','sip:'+H.SCSCF+':5060']];}],
 'MAR':[CX,303,1,function(){return [['Session-Id',sid(H.SCSCF,CX,6)],vsa(CX),['Auth-Session-State',1],['Origin-Host',H.SCSCF],['Origin-Realm',IMS],['Destination-Realm',EPC],['User-Name','sip:'+imsi+'@'+IMS],['Public-Identity','sip:+84901234567@'+IMS],['SIP-Number-Auth-Items',1],['SIP-Auth-Data-Item',[['SIP-Authentication-Scheme','Digest-AKAv1-MD5']]],['Server-Name','sip:'+H.SCSCF+':5060']];}],
 'MAA':[CX,303,0,function(){return [['Session-Id',sid(H.SCSCF,CX,6)],vsa(CX),['Result-Code',2001],['Auth-Session-State',1],['Origin-Host',H.HSS],['Origin-Realm',EPC],['SIP-Number-Auth-Items',1],['SIP-Auth-Data-Item',[['SIP-Item-Number',1],['SIP-Authentication-Scheme','Digest-AKAv1-MD5'],['SIP-Authenticate',cat(rb(16,5),rb(16,6))],['SIP-Authorization',rb(8,7)],['Confidentiality-Key',rb(16,8)],['Integrity-Key',rb(16,9)]]]];}],
 'SAR':[CX,301,1,function(){return [['Session-Id',sid(H.SCSCF,CX,7)],vsa(CX),['Auth-Session-State',1],['Origin-Host',H.SCSCF],['Origin-Realm',IMS],['Destination-Realm',EPC],['User-Name','sip:'+imsi+'@'+IMS],['Public-Identity','sip:+84901234567@'+IMS],['Server-Name','sip:'+H.SCSCF+':5060'],['Server-Assignment-Type',1]];}],
 'SAA':[CX,301,0,function(){return [['Session-Id',sid(H.SCSCF,CX,7)],vsa(CX),['Result-Code',2001],['Auth-Session-State',1],['Origin-Host',H.HSS],['Origin-Realm',EPC],['User-Data',str('<?xml version="1.0"?><IMSSubscription><PrivateID>'+imsi+'@'+IMS+'</PrivateID><ServiceProfile><PublicIdentity><Identity>sip:+84901234567@'+IMS+'</Identity></PublicIdentity><InitialFilterCriteria><Priority>0</Priority><ApplicationServer><ServerName>sip:'+H.TAS+'</ServerName></ApplicationServer></InitialFilterCriteria></ServiceProfile></IMSSubscription>')],['Charging-Information',[['Primary-Event-Charging-Function-Name','aaa://ocs01.'+EPC+':3868']]]];}],
 'LIR':[CX,302,1,function(){return [['Session-Id',sid('icscf01.'+IMS,CX,8)],vsa(CX),['Auth-Session-State',1],['Origin-Host','icscf01.'+IMS],['Origin-Realm',IMS],['Destination-Realm',IMS],['Originating-Request',0],['Public-Identity','sip:+84907654321@'+IMS]];}],
 'LIA':[CX,302,0,function(){return [['Session-Id',sid('icscf01.'+IMS,CX,8)],vsa(CX),['Result-Code',2001],['Auth-Session-State',1],['Origin-Host',H.HSS],['Origin-Realm',EPC],['Server-Name','sip:'+H.SCSCF.replace('01','02')+':5060']];}]
};
var seq=0x3000;
function dia(name,pair){var d=D[name],k=pair||name.replace(/^(.*?)(A|R|)$/,'$1'),h=(0x1a2b0000+(P.crc32c(str(k))&0xffff))>>>0,e=(0x5c6d0000+(P.crc32c(str(k+'e'))&0xffff))>>>0;
 if(!d)throw new Error('dia '+name);return P.diaEnc({cmd:d[1],app:d[0],req:!!d[2],hh:h,ee:e,avps:d[3]()});}
/* ----- GTPv2-C ----- */
var TE={mme:0x00a10001,sgw:0x00b20002,pgw:0x00c30003,enb:0x00d40004,sgwu:0x00e50005,pgwu:0x00f60006,enb2:0x00d40014};
function fte(ifType,teid,ip){return cat(by([0x80|ifType]),be(teid,4),P.ip4(ip));}
function cau(c){return by([c,0]);}
function ebi(n){return by([n]);}
function grp(inst,type,ies){return [93,inst,cat.apply(null,ies.map(function(x){return P.gie(x[0],x[1],x[2]);}))];}
function bc(ies,inst){return [93,inst||0,cat.apply(null,ies.map(function(x){return P.gie(x[0],x[1],x[2]);}))];}
function paaV6(){return cat(by([2,64]),P.ip6('2001:db8:a::'));}
function tft(){var pf=cat(by([0x21,0x30,0x11,0x40]),be(49120,2));pf=cat(by([0x21]),P.ip6('2001:db8:b::1'),by([128]),by([0x30,0x11,0x40]),be(49120,2));return cat(by([0x21,0x31,0x1f,pf.length]),pf);}
var G={
 'CSReq':[32,0,function(){return[[1,0,P.tbcd(P.A.imsi)],[76,0,P.tbcd('84901234567')],[75,0,P.tbcd('3521650912345600')],[86,0,cat(by([0x18]),P.plmn('452','99'),be(0x2a2b,2),P.plmn('452','99'),be(0x0001,2),by([0x00,0x01]))],[83,0,cat(P.plmn('452','99'))],[82,0,by([6])],[77,0,by([0x00,0x08])],[87,0,fte(10,TE.mme,N.MME.v4)],[87,1,fte(7,0,N.SGW.v4)],[71,0,P.apnEnc('ims.mnc099.mcc452.gprs')],[128,0,by([0])],[99,0,by([2])],[79,0,paaV6()],[72,0,cat(be(50000,4),be(100000,4))],[95,0,be(0x0800,2)],bc([[73,0,ebi(5)],[80,0,P.bqos(5,8,1,0,0,0,0,0)]])];}],
 'CSRsp':[33,TE.mme,function(){return[[2,0,cau(16)],[87,0,fte(11,TE.pgw,N.SGW.v4)],[79,0,paaV6()],[72,0,cat(be(50000,4),be(100000,4))],bc([[73,0,ebi(5)],[2,0,cau(16)],[87,2,fte(1,TE.sgwu,N.SGW.v4)],[87,3,fte(5,TE.pgwu,N.SGW.v4)],[80,0,P.bqos(5,8,1,0,0,0,0,0)]])];}],
 'CBReq':[95,TE.sgw,function(){return[[73,0,ebi(5)],bc([[73,0,ebi(0)],[84,0,tft()],[87,0,fte(5,TE.pgwu+1,N.SGW.v4)],[80,0,P.bqos(1,2,1,0,49000,49000,49000,49000)]])];}],
 'CBRsp':[96,TE.pgw,function(){return[[2,0,cau(16)],bc([[73,0,ebi(6)],[2,0,cau(16)],[87,0,fte(0,TE.enb,N.ENB1.v4)],[87,1,fte(1,TE.sgwu+1,N.SGW.v4)]])];}],
 'DBReq':[99,TE.sgw,function(){return[[73,0,ebi(6)],[2,0,cau(4)]].slice(0,1).concat([[2,0,by([4,0])].length?[]:[]]).filter(function(x){return x.length;});}],
 'DBRsp':[100,TE.pgw,function(){return[[2,0,cau(16)],bc([[73,0,ebi(6)],[2,0,cau(16)]])];}],
 'DDN':[176,TE.mme,function(){return[[73,0,ebi(5)],[86,0,cat(by([0x18]),P.plmn('452','99'),be(0x2a2b,2),P.plmn('452','99'),be(0x0001,2),by([0x00,0x01]))]].slice(0,1);}],
 'DDNAck':[177,TE.sgw,function(){return[[2,0,cau(16)]];}],
 'MBReq':[34,TE.sgw,function(){return[[82,0,by([6])],[86,0,cat(by([0x18]),P.plmn('452','99'),be(0x2a2b,2),P.plmn('452','99'),be(0x0002,2),by([0x00,0x02]))],bc([[73,0,ebi(5)],[87,0,fte(0,TE.enb2,N.ENB2.v4)]])];}],
 'MBRsp':[35,TE.mme,function(){return[[2,0,cau(16)],bc([[73,0,ebi(5)],[2,0,cau(16)],[87,0,fte(1,TE.sgwu,N.SGW.v4)]])];}],
 'RABReq':[170,TE.sgw,function(){return[[2,0,cau(16)]].slice(0,0).concat([[73,0,ebi(5)]].slice(0,0));}],
 'RABRsp':[171,TE.mme,function(){return[[2,0,cau(16)]];}]
};
/* DBReq: dùng EBI (instance 1 = linked EBIs) */
G.DBReq[2]=function(){return[[73,1,ebi(6)],[2,0,cau(4)].slice(0,0)].filter(function(x){return x.length;});};
G.DBReq[2]=function(){return[[73,1,ebi(6)]];};
G.RABReq[2]=function(){return[[2,0,cau(16)]].slice(0,0);};
function gtp(name,seqn){var g=G[name];if(!g)throw new Error('gtp '+name);return P.gtpEnc({type:g[0],teid:g[1],seq:seqn||0x2000+(P.crc32c(str(name))&0xfff),ies:g[2]()});}
/* ----- RTP/RTCP ----- */
function amrwb(i){var p=new Uint8Array(34);p[0]=0xf0;p[1]=0x14;var x=(i+1)*2654435761>>>0;for(var k=2;k<34;k++){x=(x*1664525+1013904223)>>>0;p[k]=(x>>>24)&255;}return p;}
function rtpPkt(i,ssrc,mark){return P.rtp(104,0x1a40+i,0x00a01000+i*320,ssrc||0x5a3c9e01,amrwb(i),mark&&i===0);}
function rtcp(){return P.rtcpSR(0x5a3c9e01,3924872401,0x80000000,0x00a02000,120,4080,{ssrc:0x7b1d4402,frac:0,lost:0,ext:0x1a5e,jit:12});}
P.dia=dia;P.gtp=gtp;P.DIAKEYS=Object.keys(D);P.GTPKEYS=Object.keys(G);P.rtpPkt=rtpPkt;P.rtcp=rtcp;P.TE=TE;P.DNAME=D;
/* ====== Bộ giải mã dựng cây từ byte ====== */
var AVPN={},AVPT={};Object.keys(P.AVP).forEach(function(k){var d=P.AVP[k];if(!AVPN[d[0]])AVPN[d[0]]=k;AVPT[d[0]]=d[2];});
AVPN[516]='Max-Requested-Bandwidth-UL';AVPN[515]='Max-Requested-Bandwidth-DL';
function u(b,o,n){var v=0;for(var i=0;i<n;i++)v=v*256+b[o+i];return v;}
function hx(b){var s='';for(var i=0;i<b.length;i++)s+=(b[i]<16?'0':'')+b[i].toString(16);return s;}
function ascii(b){var s='';for(var i=0;i<b.length;i++)s+=String.fromCharCode(b[i]);return s;}
var ENUMV={'CC-Request-Type':{1:'INITIAL_REQUEST (1)'},'RAT-Type':{1004:'EUTRAN (1004)'},'IP-CAN-Type':{5:'3GPP-EPS (5)'},'Result-Code':{2001:'DIAMETER_SUCCESS (2001)'},'Flow-Direction':{1:'DOWNLINK (1)',2:'UPLINK (2)'},'Termination-Cause':{1:'DIAMETER_LOGOUT (1)'},'Auth-Session-State':{1:'NO_STATE_MAINTAINED (1)'},'PDN-Type':{2:'IPv6 (2)'},'Media-Type':{0:'AUDIO (0)'},'Flow-Status':{2:'ENABLED (2)'},'Flow-Usage':{0:'NO_INFORMATION (0)'},'Re-Auth-Request-Type':{0:'AUTHORIZE_ONLY (0)'},'Server-Assignment-Type':{1:'REGISTRATION (1)'},'Abort-Cause':{0:'BEARER_RELEASED (0)'},'Event-Trigger':{13:'DEFAULT_EPS_BEARER_QOS_CHANGE (13)'}};
function avpTree(b,o,end){var out=[];while(o<end){var code=u(b,o,4),fl=b[o+4],len=u(b,o+5,3),hd=(fl&0x80)?12:8,nm=AVPN[code]||('AVP '+code),ty=AVPT[code],data=b.subarray(o+hd,o+len),lab='AVP: '+nm+'(' +code+') l='+len+' f='+(fl<16?'0':'')+fl.toString(16)+(fl&0x80?' V':'')+(fl&0x40?' M':'');
  if(ty==='G'){out.push([lab].concat(avpTree(b,o+hd,o+len)));}
  else{var v;if(ty==='U32'){var n=u(data,0,4);v=(ENUMV[nm]&&ENUMV[nm][n])||String(n);}else if(ty==='U8')v=ascii(data);else v=(data.length<=32?'0x':'0x')+hx(data.subarray(0,32))+(data.length>32?'…':'');
   out.push(lab+' = '+v);}
  o+=len+((4-(len%4))%4);}return out;}
function diaTree(b){var cmd=u(b,5,3),fl=b[4],app=u(b,8,4),hh=u(b,12,4),ee=u(b,16,4),nm=(P.DCMDN[cmd]||('cmd '+cmd))+(fl&0x80?'-Request':'-Answer'),an={16777238:'3GPP Gx',16777236:'3GPP Rx',16777251:'3GPP S6a/S6d',16777216:'3GPP Cx'}[app]||app;
 return ['Diameter Protocol: '+nm+' ('+cmd+') — '+an,'Version: 1','Length: '+u(b,1,3),'Flags: 0x'+fl.toString(16)+(fl&0x80?' (Request)':' (Answer)')+(fl&0x40?', Proxyable':''),'Command Code: '+cmd+' '+P.DCMDN[cmd],'ApplicationId: '+an+' ('+app+')','Hop-by-Hop Identifier: 0x'+hh.toString(16),'End-to-End Identifier: 0x'+ee.toString(16),['AVPs'].concat(avpTree(b,20,b.length))];}
var GN={};Object.keys(P.GIE).forEach(function(k){GN[P.GIE[k]]=k;});GN[73]='EPS Bearer ID (EBI)';GN[2]='Cause';GN[71]='Access Point Name (APN)';GN[72]='Aggregate Maximum Bit Rate (AMBR)';GN[80]='Bearer Level QoS';GN[87]='Fully Qualified TEID (F-TEID)';GN[93]='Bearer Context';GN[79]='PDN Address Allocation (PAA)';GN[84]='Bearer TFT';GN[86]='User Location Information (ULI)';GN[1]='IMSI';GN[76]='MSISDN';GN[75]='Mobile Equipment Identity (MEI)';GN[82]='RAT Type';GN[83]='Serving Network';GN[77]='Indication';GN[99]='PDN Type';GN[128]='Selection Mode';GN[95]='Charging Characteristics';
var GTN={32:'Create Session Request',33:'Create Session Response',34:'Modify Bearer Request',35:'Modify Bearer Response',95:'Create Bearer Request',96:'Create Bearer Response',99:'Delete Bearer Request',100:'Delete Bearer Response',170:'Release Access Bearers Request',171:'Release Access Bearers Response',176:'Downlink Data Notification',177:'Downlink Data Notification Acknowledge'};
var CAUSE={16:'Request accepted (16)',4:'Context not found (4)'};
var IFT={0:'S1-U eNodeB GTP-U (0)',1:'S1-U SGW GTP-U (1)',5:'S5/S8 PGW GTP-U (5)',7:'S5/S8 PGW GTP-C (7)',10:'S11 MME GTP-C (10)',11:'S11/S4 SGW GTP-C (11)'};
function ieVal(t,v){
 if(t===1||t===76){var s='';for(var i=0;i<v.length;i++){s+=(v[i]&15)+((v[i]>>4)===15?'':(v[i]>>4));}return s;}
 if(t===75)return ((function(){var s='';for(var i=0;i<v.length;i++){s+=(v[i]&15)+((v[i]>>4)===15?'':(v[i]>>4));}return s;})());
 if(t===2)return CAUSE[v[0]]||String(v[0]);if(t===73)return String(v[0]&15);
 if(t===71){var s2='',i2=0;while(i2<v.length){var l=v[i2];s2+=(s2?'.':'')+ascii(v.subarray(i2+1,i2+1+l));i2+=l+1;}return s2;}
 if(t===87){var it=v[0]&63;return (IFT[it]||('interface '+it))+', TEID 0x'+hx(v.subarray(1,5))+', IPv4 '+Array.prototype.slice.call(v,5,9).join('.');}
 if(t===72)return 'UL '+u(v,0,4)+' kbps, DL '+u(v,4,4)+' kbps';
 if(t===80)return 'QCI '+v[1]+', ARP PL '+((v[0]>>2)&15)+', MBR UL/DL '+u(v,2,5)+'/'+u(v,7,5)+' kbps, GBR UL/DL '+u(v,12,5)+'/'+u(v,17,5)+' kbps';
 if(t===79)return 'IPv6 prefix 2001:db8:a::/'+v[1];if(t===82)return v[0]===6?'EUTRAN (6)':String(v[0]);if(t===99)return v[0]===2?'IPv6 (2)':String(v[0]);
 if(t===83||t===86)return 'PLMN 452-99'+(t===86?', TAI/ECGI':'');if(t===84)return 'TFT: tạo mới, 1 bộ lọc (UDP, địa chỉ xa 2001:db8:b::1/128, cổng 49120)';
 return '0x'+hx(v.subarray(0,24))+(v.length>24?'…':'');}
function gtpIes(b,o,end){var out=[];while(o<end){var t=b[o],l=u(b,o+1,2),inst=b[o+3]&15,v=b.subarray(o+4,o+4+l),nm=(GN[t]||('IE '+t))+(inst?' (instance '+inst+')':'');
 if(t===93)out.push([nm+' — '+l+' byte'].concat(gtpIes(b,o+4,o+4+l)));else out.push(nm+': '+ieVal(t,v));o+=4+l;}return out;}
function gtpTree(b){var t=b[1],L=u(b,2,2),te=u(b,4,4),sq=u(b,8,3);return ['GPRS Tunneling Protocol V2: '+GTN[t]+' ('+t+')','Flags: 0x'+b[0].toString(16)+' (version 2, T=1 có TEID)','Message Type: '+GTN[t]+' ('+t+')','Message Length: '+L,'Tunnel Endpoint Identifier: 0x'+te.toString(16),'Sequence Number: 0x'+sq.toString(16),['Information Elements'].concat(gtpIes(b,12,b.length))];}
function rtpTree(b){return ['Real-Time Transport Protocol','Version: 2','Payload type: ('+(b[1]&127)+') '+((b[1]&127)===104?'AMR-WB (dynamic 104)':'?')+(b[1]&128?' — Marker':''),'Sequence number: '+u(b,2,2),'Timestamp: '+u(b,4,4),'Synchronization Source identifier: 0x'+hx(b.subarray(8,12)),['Payload: AMR-WB octet-aligned, '+(b.length-12)+' byte','CMR: 15 (không yêu cầu đổi chế độ)','ToC: FT=2 (12,65 kbit/s), Q=1 (khung tốt)','Speech data (mã hoá giọng, ngẫu nhiên minh hoạ)']];}
function rtcpTree(b){return ['Real-Time Transport Control Protocol','Sender Report (200): SSRC 0x'+hx(b.subarray(4,8)),'NTP timestamp, RTP timestamp, Sender packet count 120, octet count 4080','Reception report block: SSRC 0x7b1d4402, fraction lost 0, cumulative lost 0','Source description (202): CNAME ue-a'];}
P.diaTree=diaTree;P.gtpTree=gtpTree;P.rtpTree=rtpTree;P.rtcpTree=rtcpTree;
})();

/* ===== Thư viện bản tin (3): S1AP/NAS/RRC/X2AP chỉ giải mã (ASN.1 PER không sinh hex) ===== */
(function(){
var P=window.__PCAP;if(!P||P.TR)return;
var TAI='TAI: PLMN 452-99, TAC 0x2a2b',CGI='E-UTRAN-CGI: PLMN 452-99, Cell Identity 0x0100011';
function s1(name,code,crit,body,pre){return ['S1AP: '+name,'procedureCode: '+code,'criticality: '+crit].concat(body);}
var TR={
 attReq:['S1AP','Initial UE Message + NAS Attach Request','s1c',s1('InitialUEMessage','id-initialUEMessage (12)','ignore',['eNB-UE-S1AP-ID: 4121',['NAS-PDU — EMM: Attach request (0x41)','Security header: Plain NAS (0)','EPS attach type: EPS attach (1)','NAS KSI: 7','EPS mobile identity: IMSI 452990000012345','UE network capability: EEA0–2, EIA1–2, UEA/UIA, SRVCC to GERAN/UTRAN capability = 1','ESM message container → PDN connectivity request (APN ims, PDN type IPv4v6, PCO: P-CSCF address request, IM CN signalling flag)','Voice domain preference and UE\'s usage setting: IMS PS voice preferred, CS voice as secondary'],TAI,CGI,'RRC-Establishment-Cause: mo-Signalling'])],
 attAcc:['S1AP','Downlink NAS Transport: Attach Accept + Activate default EPS bearer','s1c',s1('DownlinkNASTransport','id-downlinkNASTransport (11)','ignore',['MME-UE-S1AP-ID: 7001','eNB-UE-S1AP-ID: 4121',['NAS-PDU — EMM: Attach accept (0x42), có bảo vệ toàn vẹn và mã hoá','EPS attach result: EPS only','T3412 timer: 54 phút','TAI list: 452-99, TAC 0x2a2b','EPS network feature support: IMS VoPS = 1 (hỗ trợ thoại IMS qua PS), EMC BS = 0, ...','GUTI: 452-99, MMEGI 0x8001, MMEC 0x01, M-TMSI 0xc0a80101','ESM message container → Activate default EPS bearer context request (xem bước kế)']])],
 pdnReq:['NAS','PDN Connectivity Request (APN ims)','s1c',s1('UplinkNASTransport','id-uplinkNASTransport (13)','ignore',['MME-UE-S1AP-ID: 7001','eNB-UE-S1AP-ID: 4121',['NAS-PDU — ESM: PDN connectivity request (0xd0)','EPS bearer identity: 0, PTI: 1','Request type: initial request','PDN type: IPv6','Access point name: ims','Protocol configuration options: P-CSCF IPv6 Address Request, DNS Server IPv6 Address Request, IM CN Subsystem Signaling Flag, IPv4 MTU Request']])],
 actDef:['NAS','Activate default EPS bearer context request (QCI 5)','s1c',s1('E-RABSetupRequest (kèm Attach Accept)','id-E-RABSetup (5)','reject',['E-RAB ID: 5','E-RAB Level QoS: QCI 5, ARP PL 8, pre-emption cap = shall not trigger, vulnerability = not pre-emptable','Transport layer address: S-GW 10.10.3.31','GTP-TEID: 0x00e50005',['NAS-PDU — ESM: Activate default EPS bearer context request (0xc1)','EPS QoS: QCI 5','APN: ims.mnc099.mcc452.gprs','PDN address: IPv6 interface identifier 0x0000000000000001 (prefix gán qua RA)','APN-AMBR: UL 50 Mbit/s, DL 100 Mbit/s','PCO: P-CSCF address 2001:db8:5::51, DNS 2001:db8:5::53']])],
 actDefRsp:['NAS','Initial Context Setup Response + Activate default bearer accept','s1c',s1('InitialContextSetupResponse','id-InitialContextSetup (9)','reject',['E-RAB Setup List: E-RAB ID 5, eNB TEID 0x00d40004, eNB 10.20.1.11'])],
 svcReq:['NAS','RRC Connection Setup + NAS Service Request + S1AP Initial UE Message','s1c',['RRC (qua vô tuyến): RRCConnectionRequest (ue-Identity: s-TMSI, cause mo-Data) → RRCConnectionSetup → RRCConnectionSetupComplete (dedicatedInfoNAS = Service request)']
  .concat([s1('InitialUEMessage','id-initialUEMessage (12)','ignore',['eNB-UE-S1AP-ID: 4121',['NAS-PDU — EMM: Service request (0x4d), security header type 12 (Service request)','KSI and sequence number: 7 / 3','Message authentication code (short): 0x9a3c'],'S-TMSI: MMEC 0x01, M-TMSI 0xc0a80101',TAI,CGI,'RRC-Establishment-Cause: mo-Data'])])],
 svcReqB:['NAS','Service Request của UE B (đáp Paging)','s1c',['RRC: RRCConnectionRequest (cause mt-Access) → Setup → SetupComplete (Service request)'].concat([s1('InitialUEMessage','id-initialUEMessage (12)','ignore',['eNB-UE-S1AP-ID: 5230',['NAS-PDU — EMM: Service request (0x4d)'],'S-TMSI: MMEC 0x01, M-TMSI 0xc0a80102',TAI,CGI,'RRC-Establishment-Cause: mt-Access'])])],
 icsReq:['S1AP','Initial Context Setup Request','s1c',s1('InitialContextSetupRequest','id-InitialContextSetup (9)','reject',['MME-UE-S1AP-ID: 7001','eNB-UE-S1AP-ID: 4121','UE Aggregate Maximum Bit Rate: UL 50 Mbit/s, DL 100 Mbit/s',['E-RAB to Be Setup List','E-RAB ID 5, QCI 5, ARP PL 8','Transport layer address 10.10.3.31, GTP-TEID 0x00e50005'],'UE Security Capabilities: EEA0–2, EIA1–2','Security Key (KeNB): 256 bit','UE Radio Capability / Subscriber Profile ID for RAT/Frequency priority: 1','CS Fallback Indicator: không có (VoLTE)'])],
 icsRsp:['S1AP','Initial Context Setup Response','s1c',s1('InitialContextSetupResponse','id-InitialContextSetup (9)','reject',['MME-UE-S1AP-ID: 7001','eNB-UE-S1AP-ID: 4121',['E-RAB Setup List','E-RAB ID 5, eNB 10.20.1.11, GTP-TEID 0x00d40004']])],
 paging:['S1AP','Paging (UE B rảnh)','s1c',s1('Paging','id-Paging (10)','ignore',['UE Identity Index Value: IMSI mod 1024','UE Paging Identity: S-TMSI (MMEC 0x01, M-TMSI 0xc0a80102)','CN Domain: ps','List of TAIs: 452-99, TAC 0x2a2b'])],
 erabSetupReq:['S1AP','E-RAB Setup Request (QCI 1) + Activate dedicated EPS bearer','s1c',s1('E-RABSetupRequest','id-E-RABSetup (5)','reject',['MME-UE-S1AP-ID: 7002','eNB-UE-S1AP-ID: 5230',['E-RAB to Be Setup List','E-RAB ID 6','E-RAB Level QoS: QCI 1 (GBR), ARP PL 2, GBR UL/DL 49 kbit/s, MBR 49 kbit/s','Transport layer address 10.10.3.31, GTP-TEID 0x00e50006',['NAS-PDU — ESM: Activate dedicated EPS bearer context request (0xc5)','Linked EPS bearer identity: 5','EPS QoS: QCI 1, GBR/MBR UL-DL 49 kbit/s','TFT: create new TFT, 1 packet filter: remote 2001:db8:b::1/128, UDP, local port 49120']]])],
 erabSetupRsp:['S1AP','E-RAB Setup Response + Activate dedicated bearer accept','s1c',s1('E-RABSetupResponse','id-E-RABSetup (5)','reject',['MME-UE-S1AP-ID: 7002','eNB-UE-S1AP-ID: 5230',['E-RAB Setup List','E-RAB ID 6, eNB 10.20.1.12, GTP-TEID 0x00d40014'],'(NAS tiếp theo trong UplinkNASTransport: Activate dedicated EPS bearer context accept 0xc6)'])],
 erabRelCmd:['S1AP','E-RAB Release Command + Deactivate EPS bearer','s1c',s1('E-RABReleaseCommand','id-E-RABRelease (7)','reject',['MME-UE-S1AP-ID: 7001','eNB-UE-S1AP-ID: 4121','E-RAB To Be Released List: E-RAB ID 6, Cause: nas (normal-release)',['NAS-PDU — ESM: Deactivate EPS bearer request (0xcd)','EPS bearer identity: 6','ESM cause: Regular deactivation (36)']])],
 erabRelRsp:['S1AP','E-RAB Release Response + Deactivate bearer accept','s1c',s1('E-RABReleaseResponse','id-E-RABRelease (7)','reject',['E-RAB Release List: E-RAB ID 6','(NAS: Deactivate EPS bearer context accept 0xce)'])],
 ueRelReq:['S1AP','UE Context Release Request (mất liên kết vô tuyến)','s1c',s1('UEContextReleaseRequest','id-UEContextReleaseRequest (18)','ignore',['MME-UE-S1AP-ID: 7001','eNB-UE-S1AP-ID: 4121','Cause: radioNetwork — radio-connection-with-ue-lost (21)'])],
 pathReq:['S1AP','Path Switch Request','s1c',s1('PathSwitchRequest','id-PathSwitchRequest (3)','reject',['eNB-UE-S1AP-ID (mới): 4400','E-RAB To Be Switched in Downlink List: E-RAB ID 5, eNB đích 10.20.1.12, TEID 0x00d40014','Source MME UE S1AP ID: 7001',CGI.replace('0100011','0100012'),TAI,'UE Security Capabilities'])],
 pathAck:['S1AP','Path Switch Request Acknowledge','s1c',s1('PathSwitchRequestAcknowledge','id-PathSwitchRequest (3)','reject',['MME-UE-S1AP-ID: 7001','eNB-UE-S1AP-ID: 4400','E-RAB To Be Switched in Uplink List: E-RAB ID 5, S-GW 10.10.3.31, TEID 0x00e50005','Security Context: Next Hop Chaining Count 1, NH'])],
 meas:['RRC','MeasurementReport (sự kiện A3)','uu',['RRC: UL-DCCH-Message / measurementReport','measId: 1','measResultServCell: rsrpResult 38 (−102 dBm), rsrqResult 22','measResultNeighCells: physCellId 112, rsrpResult 46 (−94 dBm)','Sự kiện A3: ô láng giềng tốt hơn ô phục vụ một ngưỡng offset (3 dB) trong TTT (40 ms)']],
 reconfDrb:['RRC','RRCConnectionReconfiguration (thêm DRB QCI 1)','uu',['RRC: DL-DCCH-Message / rrcConnectionReconfiguration','rrc-TransactionIdentifier: 1','radioResourceConfigDedicated','  srb-ToAddModList: (không đổi)','  drb-ToAddModList: eps-BearerIdentity 6, drb-Identity 2, pdcp-Config (RLC UM, SN 7 bit, ROHC profile 0x0001 RTP/UDP/IP), rlc-Config um-Bi-Directional (SN-FieldLength 5), logicalChannelIdentity 4, LCG 1, prioritisedBitRate 8','  mac-MainConfig: DRX theo C-DRX VoLTE (onDuration 4 ms, cycle 40 ms), SR config, BSR','dedicatedInfoNAS: Activate dedicated EPS bearer context request']],
 reconfCmp:['RRC','RRCConnectionReconfigurationComplete + (NAS accept)','uu',['RRC: UL-DCCH-Message / rrcConnectionReconfigurationComplete','rrc-TransactionIdentifier: 1']],
 reconfHO:['RRC','RRCConnectionReconfiguration (mobilityControlInfo)','uu',['RRC: DL-DCCH-Message / rrcConnectionReconfiguration','mobilityControlInfo','  targetPhysCellId: 112','  carrierFreq: dl-CarrierFreq 1800 (EARFCN)','  t304: ms100','  newUE-Identity (C-RNTI): 0x4a21','  radioResourceConfigCommon (PRACH, PDSCH, PUSCH, SRS…)','  rach-ConfigDedicated: ra-PreambleIndex 28, ra-PRACH-MaskIndex 0','nextHopChainingCount: 1']],
 rach:['RRC','RACH (MAC) + RRCConnectionReconfigurationComplete','uu',['MAC: Random Access Preamble (index 28, RA-RNTI)','MAC: Random Access Response (UL grant, Timing Advance, Temp C-RNTI)','RRC: UL-DCCH-Message / rrcConnectionReconfigurationComplete','Thời gian gián đoạn thoại ≈ 30–50 ms (cần ≤ 100 ms để người nghe không nhận ra)']],
 hoReq:['X2AP','Handover Request','x2',['X2AP: id-handoverPreparation (0)','Old eNB UE X2AP ID: 17','Cause: radioNetwork — handover-desirable-for-radio-reasons','Target Cell ID: PLMN 452-99, Cell Identity 0x0100012','GUMMEI: 452-99, MMEGI 0x8001, MMEC 0x01','UE Context Information: MME UE S1AP ID 7001, UE Security Capabilities, AS Security Information (KeNB*), UE AMBR 50/100 Mbit/s',['E-RABs To Be Setup List','E-RAB ID 5: QCI 5, GTP tunnel endpoint S-GW 10.10.3.31 TEID 0x00e50005','E-RAB ID 6: QCI 1 GBR 49 kbit/s, GTP tunnel endpoint S-GW 10.10.3.31 TEID 0x00e50006'],'RRC Context: HandoverPreparationInformation']],
 hoAck:['X2AP','Handover Request Acknowledge','x2',['X2AP: id-handoverPreparation (0), successfulOutcome','Old eNB UE X2AP ID: 17, New eNB UE X2AP ID: 31',['E-RABs Admitted List','E-RAB ID 5 (UL/DL forwarding GTP tunnel endpoint)','E-RAB ID 6 (đã được chấp nhận — bearer QCI 1 cần giữ nguyên admission)'],'Target eNB To Source eNB Transparent Container: RRCConnectionReconfiguration (mobilityControlInfo)']],
 snStat:['X2AP','SN Status Transfer (+ chuyển tiếp dữ liệu GTP-U)','x2',['X2AP: id-snStatusTransfer (4)','E-RABs Subject To Status Transfer List','  E-RAB ID 5: receiveStatusofULPDCPSDUs, uL-COUNTValue (PDCP-SN, HFN), dL-COUNTValue','(E-RAB ID 6 dùng RLC UM — không cần SN status)','Dữ liệu: GTP-U (UDP 2152) từ eNB nguồn tới eNB đích qua đường hầm chuyển tiếp (DL forwarding)']],
 ueRelX2:['X2AP','UE Context Release','x2',['X2AP: id-uEContextRelease (5)','Old eNB UE X2AP ID: 17','New eNB UE X2AP ID: 31']],
 enum:['DNS/Cx','Truy vấn số: ENUM (DNS NAPTR) + Cx LIR/LIA + iFC (không sinh hex)','mix',['ENUM: truy vấn NAPTR cho 1.2.3.4.5.6.7.0.9.4.8.e164.arpa → sip:+84907654321@ims… (số thuộc mạng nội bộ)','Cx Location-Info-Request: tìm S-CSCF đang phục vụ thuê bao B (xem gói LIR/LIA bên dưới)','iFC: S-CSCF áp tiêu chí lọc ban đầu (Initial Filter Criteria) → chuyển INVITE tới TAS (ISC)','T-ADS: TAS chọn miền (PS VoLTE hay CS) cho cuộc gọi đến thuê bao B dựa trên Sh/ MAP/ Diameter S6a "UE reachability"']],
 sess:['—','Sự kiện nội bộ (không phát sinh gói tin)','int',['Bộ đếm / bộ hẹn giờ chạy nội bộ ở nút mạng — không có bản tin trên dây ở bước này.']]
};
P.TR=TR;
})();

/* ===== Thư viện bản tin (3b): SRVCC, gọi ra mạng kênh (chỉ giải mã) ===== */
(function(){
var P=window.__PCAP;if(!P||!P.TR||P.TR.sr1)return;
var T=P.TR;
T.sr1=['S1AP','Handover Required — Source to Target Transparent Container, SRVCC HO Indication','s1c',['RRC: MeasurementReport (sự kiện B2: LTE phục vụ < ngưỡng1, ô UTRAN/GERAN > ngưỡng2)','S1AP: HandoverRequired (id-HandoverPreparation, 0)','MME-UE-S1AP-ID: 7001, eNB-UE-S1AP-ID: 4121','HandoverType: ltetoutran (hoặc ltetogeran)','Cause: radioNetwork — time-critical-handover (SRVCC)','Target ID: targetRNC-ID (RNC 452-99, LAC 0x1001, RNC-ID 21) hoặc CGI GERAN','SRVCC HO Indication: CSonly','Source to Target Transparent Container: RRC/BSS container']];
T.sr2=['GTPv2 Sv','SRVCC PS to CS Request (giao diện Sv, TS 29.280)','gtp',['GTPv2-C Sv (UDP 2123): Message Type 25 — SRVCC PS to CS Request','IMSI: 452990000012345','Source to Target Transparent Container','MM Context for E-UTRAN SRVCC: Mobile Station Classmark 2/3, Supported Codec List (AMR-WB, AMR)','STN-SR: +84-xxxxxxxx (số chuyển thoại tới ATCF)','C-MSISDN: +84901234567','Target RNC ID / Target Cell ID','(Bản tin Sv dùng GTPv2 nhưng không sinh hex ở đây vì khuôn IE riêng của Sv)']];
T.sr3=['RANAP/BSSMAP','Relocation Request / Handover Request (MSC → RNC hoặc BSC)','s1c',['RANAP: RelocationRequest (MSC Server → RNC)','Permanent NAS UE Identity: IMSI','Cause: relocation-desirable-for-radio-reasons','CN Domain Indicator: cs-domain','Integrity Protection / Encryption Information','RAB To Be Setup List: RAB-ID 1, Traffic class conversational, Bit rate 12.65 kbit/s (AMR-WB), SDU format',['Source RNC To Target RNC Transparent Container','chứa cấu hình radio mà UE sẽ nhận trong HO command'],'Reply: RelocationRequestAcknowledge']];
T.sr4=['SIP','INVITE tới STN-SR (MSC → ATCF) + cập nhật media','sip',['SIP (qua MSC Server Enhanced for SRVCC, TS 23.237):','INVITE tel:+84-STN-SR SIP/2.0','P-Asserted-Identity: <tel:+84901234567>','Contact: <sip:msc.ims…;+g.3gpp.srvcc-alerting>','Accept-Contact: *;+g.3gpp.icsi-ref="urn%3Aurn-7%3A3gpp-service.ims.icsi.mmtel"','SDP: MGW của MSC (m=audio … RTP/AVP 104 …, c=IN IP4 MGW)','ATCF nhận, gửi re-INVITE/UPDATE tới đầu xa với SDP mới của ATGW (media chuyển sang MGW mà đầu xa không bị gián đoạn dài)','Thực tế có nhiều chặng: MSC → ATCF → SCC AS → S-CSCF → bên B']];
T.sr5=['RRC','Handover Command: MobilityFromEUTRACommand (SRVCC)','uu',['S1AP (eNB nhận): HandoverCommand ← MME ← MSC','RRC: DL-DCCH-Message / mobilityFromEUTRACommand','cs-FallbackIndicator: false','purpose: handover (targetRAT-Type utra hoặc geran)','targetRAT-MessageContainer: HANDOVER TO UTRAN COMMAND (hoặc Handover Command 44.018)','nas-SecurityParamFromEUTRA','UE tắt LTE, đồng bộ sang UTRAN/GERAN, gửi Handover Complete']];
T.sr6=['RTP/CS','Tiếng nói qua mạng kênh (CS)','media',['UE ↔ RNC/BSC: kênh thoại AMR (Iu-UP hoặc A/Abis)','MGW của MSC ↔ ATGW: RTP AMR (hoặc AMR-WB) tới đầu xa','Mục tiêu gián đoạn tiếng dưới 300 ms (eSRVCC, TS 23.216)']];
T.sr7=['GTPv2','Dọn bearer phía LTE (Delete Bearer / Release)','gtp',['MME → S-GW → P-GW: Delete Bearer Command / Release Access Bearers cho bearer QCI 1 (GBR)','PCRF: Rx ASR/STR → gỡ luật PCC của thoại','Các bearer dữ liệu được PS handover sang mạng đích (SGSN) hoặc tạm giữ']];
T.isup=['ISUP','IAM (Initial Address Message) tới mạng kênh qua MGCF','isup',['MGCF đổi SIP INVITE ↔ ISUP/SIGTRAN (M3UA/SCTP): ISUP IAM','Called Party Number: 84907654321 (nature: international/national)','Calling Party Number: 84901234567, presentation allowed','Nature of connection indicators, Forward call indicators','Transmission medium requirement: 3.1 kHz audio / speech','IM-MGW (H.248) chuyển mã AMR-WB ↔ G.711 (PCMA)']];
})();

/* ===== Ghép bản tin vào từng bước callflow ===== */
(function(){
var P=window.__PCAP;if(!P||P.MAP)return;
var S=function(t,o){return Object.assign({k:'sip',t:t},o||{});};
var D=function(q,a,o){return {k:'dia',q:q,a:a,o:o||{}};};
var G=function(q,a,o){return {k:'gtp',q:q,a:a,o:o||{}};};
var X=function(id,o){return {k:'asn',id:id,o:o||{}};};
var R=function(n,o){return {k:'rtp',n:n,o:o||{}};};
var A=function(t,o){return S(t,Object.assign({leg:'A'},o||{}));};
var B=function(t,o){return S(t,Object.assign({leg:'B'},o||{}));};
var rsp=function(t,cm,o){return Object.assign({cm:cm,tag:true,r:1},o||{});};
var M={};
/* --- đăng ký --- */
M.reg=[
 ['Attach Request + PDN Connectivity',[X('attReq')]],
 ['AIR/AIA, ULR/ULA',[D('AIR','AIA'),D('ULR','ULA')]],
 ['Attach Accept (IMS VoPS=1)',[X('attAcc')]],
 ['PDN Connectivity Request (APN ims)',[X('pdnReq')]],
 ['Create Session Request / Response',[G('CSReq','CSRsp')]],
 ['Gx CCR-I / CCA-I',[D('CCR-I','CCA-I')]],
 ['Activate Default Bearer QCI 5',[X('actDef'),X('actDefRsp',{r:1})]],
 ['REGISTER',[A('REGISTER')]],
 ['REGISTER → 401 → REGISTER',[A('REGISTER',{s:'PCA',d:'SC'}),D('UAR','UAA',{s:'SC',d:'HSS'}),D('MAR','MAA',{s:'SC',d:'HSS'}),A('401',{cm:'REGISTER',tag:true,s:'SC',d:'PCA'}),A('401',{cm:'REGISTER',tag:true,s:'PCA',d:'UEA'}),A('REGISTER',{auth:true,s:'UEA',d:'PCA'}),A('REGISTER',{auth:true,s:'PCA',d:'SC'}),D('SAR','SAA',{s:'SC',d:'HSS'})]],
 ['200 OK (REGISTER)',[A('200',{cm:'REGISTER',tag:true,s:'SC',d:'PCA'}),A('200',{cm:'REGISTER',tag:true,s:'PCA',d:'UEA'})]],
 ['Rx AAR',[D('AAR','AAA')]]
];
/* --- cuộc gọi đầy đủ --- */
M.full=[
 ['Service Request (A rảnh)',[X('svcReq')]],
 ['Initial Context Setup',[X('icsReq'),X('icsRsp',{r:1})]],
 ['INVITE (SDP offer)',[A('INVITE',{sdp:'offer'})]],
 ['100 Trying',[A('100',{cm:'INVITE'})]],
 ['iFC, ENUM, LIR, T-ADS',[X('enum',{s:'SC',d:'HSS'}),D('LIR','LIA',{s:'SC',d:'HSS'})]],
 ['INVITE',[B('INVITE',{sdp:'offer',s:'SC',d:'PCB'})],'#2'],
 ['DDN → Paging',[G('DDN','DDNAck'),X('paging',{s:'MME',d:'ENB2'})]],
 ['Service Request (B)',[X('svcReqB')]],
 ['INVITE',[B('INVITE',{sdp:'offer',s:'PCB',d:'UEB'})],'#3'],
 ['183 Session Progress',[B('183',{cm:'INVITE',tag:true,sdp:'ans'})]],
 ['Rx AAR (B)',[D('AAR','AAA')]],
 ['Gx RAR / RAA',[D('GXRAR','GXRAA')]],
 ['Create Bearer Request',[G('CBReq',null)]],
 ['E-RAB Setup Request (QCI 1)',[X('erabSetupReq')]],
 ['RRC Reconfiguration (DRB QCI 1)',[X('reconfDrb')]],
 ['E-RAB Setup Response + Accept',[X('erabSetupRsp')]],
 ['Create Bearer Response',[G('CBRsp',null)]],
 ['183 (SDP answer) tới A',[B('183',{cm:'INVITE',tag:true,sdp:'ans',s:'PCB',d:'SC'}),B('183',{cm:'INVITE',tag:true,sdp:'ans',s:'SC',d:'PCA'}),A('183',{cm:'INVITE',tag:true,sdp:'ans',s:'PCA',d:'UEA'})]],
 ['Rx AAR (A)',[D('AAR','AAA')],'#2'],
 ['Gx RAR / RAA (A)',[D('GXRAR','GXRAA')],'#2'],
 ['E-RAB Setup Request (QCI 1, A)',[G('CBReq',null,{s:'SGW',d:'MME'}),X('erabSetupReq')]],
 ['RRC Reconfiguration (A)',[X('reconfDrb')]],
 ['E-RAB Setup Resp → Create Bearer Resp',[X('erabSetupRsp',{s:'ENB1',d:'MME'}),G('CBRsp',null,{s:'MME',d:'SGW'})]],
 ['PRACK / 200 OK',[A('PRACK',{s:'UEA',d:'PCA'}),A('200',{cm:'PRACK',tag:true,s:'PCA',d:'UEA'})]],
 ['UPDATE (curr:qos sendrecv)',[A('UPDATE',{sdp:'updA',s:'UEA',d:'PCA'}),A('200',{cm:'UPDATE',tag:true,sdp:'updB',s:'PCA',d:'UEA'})]],
 ['180 Ringing',[A('180',{cm:'INVITE',tag:true,s:'PCA',d:'UEA'})]],
 ['200 OK (INVITE)',[A('200',{cm:'INVITE',tag:true,s:'PCA',d:'UEA'})]],
 ['ACK',[A('ACK',{s:'UEA',d:'PCA'})]],
 ['RTP / RTCP',[R(3),R(1,{rtcp:true})]],
 ['BYE / 200 OK',[A('BYE',{s:'UEA',d:'PCA'}),A('200',{cm:'BYE',tag:true,s:'PCA',d:'UEA'})]],
 ['Rx STR / STA',[D('STR','STA')]],
 ['Delete Bearer → E-RAB Release',[G('DBReq',null,{s:'SGW',d:'MME'}),X('erabRelCmd',{s:'MME',d:'ENB1'}),X('erabRelRsp',{s:'ENB1',d:'MME'}),G('DBRsp',null,{s:'MME',d:'SGW'})]]
];
/* --- nhạc chờ --- */
var CH=function(t,hops,o){return hops.map(function(h){return S(t,Object.assign({s:h[0],d:h[1]},o||{}));});};
var HP=[['UEA','PCA'],['PCA','SC'],['SC','TA'],['SC2','TB'],['PCB','UEB']];
M.crbt=[
 ['INVITE',CH('INVITE',HP,{leg:'A',sdp:'offer'})],
 ['183, PRACK, bearer QCI 1',[A('183',{cm:'INVITE',tag:true,sdp:'ans',s:'UEB',d:'PCB'}),A('183',{cm:'INVITE',tag:true,sdp:'ans',s:'PCA',d:'UEA'}),A('PRACK',{s:'UEA',d:'PCA'}),A('200',{cm:'PRACK',tag:true,s:'PCA',d:'UEA'}),D('AAR','AAA',{s:'PCA',d:'PCRF'}),D('GXRAR','GXRAA',{s:'PCRF',d:'SGW'}),G('CBReq',null),X('erabSetupReq',{s:'MME',d:'ENB1'})]],
 ['180 Ringing',[A('180',{cm:'INVITE',tag:true,s:'UEB',d:'PCB'}),A('180',{cm:'INVITE',tag:true,s:'PCA',d:'UEA'})]],
 ['INVITE (máy chủ nhạc chờ)',[S('INVITE',{leg:'M',sdp:'mrfo',s:'TB',d:'MRF'})]],
 ['200 OK (SDP nhạc chờ)',[S('200',{cm:'INVITE',leg:'M',tag:true,sdp:'mrf',s:'MRF',d:'TB'})]],
 ['UPDATE (P-Early-Media: sendonly)',[A('UPDATE',{snd:'callee',sdp:'mrf',s:'PCA',d:'UEA',x:[['P-Early-Media','sendonly']]})]],
 ['200 OK (UPDATE)',[A('200',{cm:'UPDATE',tag:true,s:'UEA',d:'PCA'})]],
 ['ACK',[S('ACK',{leg:'M',s:'TB',d:'MRF'})]],
 ['200 OK (INVITE)',[B('200',{cm:'INVITE',tag:true,s:'UEB',d:'PCB'})]],
 ['BYE (dừng nhạc chờ)',[S('BYE',{leg:'M',s:'TB',d:'MRF'})]],
 ['UPDATE (SDP của B)',[A('UPDATE',{snd:'callee',sdp:'updB',s:'PCA',d:'UEA'})]],
 ['Chờ 200 OK (UPDATE)…',[X('sess')]],
 ['200 OK phát lại (không có ACK)',[B('200',{cm:'INVITE',tag:true,s:'UEB',d:'PCB'})]],
 ['408 Request Timeout',[B('408',{cm:'INVITE',tag:true,s:'SC2',d:'TB'})]],
 ['BYE tới B',[B('BYE',{s:'PCB',d:'UEB',reason:'SIP;cause=408;text="No ACK received"'})]],
 ['408 (UPDATE) tới A',[A('408',{cm:'UPDATE',tag:true,s:'PCA',d:'UEA'})]]
];
M.crbtok=M.crbt.slice(0,11).concat([
 ['200 OK (UPDATE)',[A('200',{cm:'UPDATE',tag:true,sdp:'updA',s:'UEA',d:'PCA'})],'#2'],
 ['200 OK (INVITE)',[A('200',{cm:'INVITE',tag:true,s:'PCA',d:'UEA'})],'#2'],
 ['ACK',[A('ACK',{s:'UEA',d:'PCA'})],'#2'],
 ['RTP',[R(3)]]
]);
/* --- giải phóng --- */
M.relbye=[['BYE',[A('BYE',{s:'UEA',d:'PCA'})]],['200 OK (BYE)',[A('200',{cm:'BYE',tag:true,s:'PCA',d:'UEA'})]],['Rx STR / STA',[D('STR','STA')]],['Gx RAR (gỡ luật)',[D('GXRAR-DEL','GXRAA')]],['Delete Bearer Request',[G('DBReq',null)]],['E-RAB Release Command',[X('erabRelCmd')]],['E-RAB Release Response',[X('erabRelRsp')]],['Delete Bearer Response',[G('DBRsp',null)]]];
M.relrlf=[['Mất liên kết vô tuyến',[X('sess')]],['UE Context Release Request',[X('ueRelReq')]],['Release Access Bearers / Delete Bearer',[G('RABReq','RABRsp'),G('DBReq','DBRsp',{s:'SGW',d:'MME'})]],['Rx ASR (Abort-Cause 0)',[D('ASR','ASA')]],['BYE (Reason) tới B',[B('BYE',{s:'PCA',d:'SC',reason:'SIP;cause=503;text="Radio connection lost (QCI 1 released)"'})]]];
M.relrtp=[['RTP một chiều ngừng',[R(3,{oneway:true})]],['Hết bộ đếm RTP',[X('sess')]],['BYE (RTP timeout)',[B('BYE',{s:'PCA',d:'SC',reason:'SIP;cause=503;text="RTP timeout"'})]],['BYE tới A',[A('BYE',{snd:'callee',s:'PCA',d:'UEA',reason:'SIP;cause=503;text="RTP timeout"'})]]];
M.relst=[['Phiên không được làm mới',[X('sess')]],['BYE (session timer)',[B('BYE',{s:'SC',d:'PCB',reason:'SIP;cause=408;text="Session timer expired"'})]]];
M.x2=[['Measurement Report (A3)',[X('meas')]],['Handover Request',[X('hoReq')]],['Nhận vào ở eNB đích',[X('sess')]],['Handover Request Ack',[X('hoAck')]],['RRC Reconfiguration (mobilityControlInfo)',[X('reconfHO')]],['SN Status Transfer, chuyển tiếp dữ liệu',[X('snStat')]],['RACH, RRC Reconfiguration Complete',[X('rach')]],['Path Switch Request / Ack',[X('pathReq'),G('MBReq','MBRsp',{s:'MME',d:'SGW'}),X('pathAck',{s:'MME',d:'ENB2'})]],['UE Context Release',[X('ueRelX2')]]];
/* --- khung e2e, SRVCC (khớp theo tiêu đề bước) --- */
M.e2e=[
 ['Gắn vào mạng',[X('attReq'),D('AIR','AIA',{s:'MME',d:'HSS'}),D('ULR','ULA',{s:'MME',d:'HSS'}),X('attAcc',{s:'MME',d:'UEA'})]],
 ['Kết nối APN ims và bearer báo hiệu QCI 5',[X('pdnReq',{s:'UEA',d:'MME'}),G('CSReq','CSRsp',{s:'MME',d:'SGW'}),D('CCR-I','CCA-I',{s:'SGW',d:'PCRF'}),X('actDef',{s:'MME',d:'UEA'})]],
 ['Đăng ký IMS',[A('REGISTER',{s:'UEA',d:'PCA'}),A('REGISTER',{s:'PCA',d:'SC'}),D('UAR','UAA',{s:'SC',d:'HSS'}),D('MAR','MAA',{s:'SC',d:'HSS'}),A('401',{cm:'REGISTER',tag:true,s:'SC',d:'UEA'}),A('REGISTER',{auth:true,s:'UEA',d:'SC'}),D('SAR','SAA',{s:'SC',d:'HSS'}),A('200',{cm:'REGISTER',tag:true,s:'SC',d:'UEA'})]],
 ['Báo hiệu lập cuộc gọi',[A('INVITE',{sdp:'offer',s:'UEA',d:'PCA'}),A('INVITE',{sdp:'offer',s:'PCA',d:'SC'}),A('INVITE',{sdp:'offer',s:'SC',d:'TA'})]],
 ['Lập bearer thoại QCI 1',[D('AAR','AAA',{s:'PCA',d:'PCRF'}),D('GXRAR','GXRAA',{s:'PCRF',d:'SGW'}),G('CBReq',null),X('erabSetupReq'),X('reconfDrb',{s:'ENB1',d:'UEA'}),X('erabSetupRsp',{s:'ENB1',d:'MME'}),G('CBRsp',null,{s:'MME',d:'SGW'})]],
 ['Đường đi của tiếng nói',[R(3),R(1,{rtcp:true})]],
 ['Nhạc chờ, thông báo',[S('INVITE',{leg:'M',sdp:'mrfo',s:'TA',d:'MRF'}),S('200',{cm:'INVITE',leg:'M',tag:true,sdp:'mrf',s:'MRF',d:'TA'})]],
 ['Gọi ra mạng kênh',[X('isup',{s:'SC',d:'SC'})]],
 ['Kết thúc và tính cước',[A('BYE',{s:'UEA',d:'PCA'}),D('STR','STA',{s:'PCA',d:'PCRF'}),D('GXRAR-DEL','GXRAA',{s:'PCRF',d:'SGW'}),G('DBReq','DBRsp',{s:'SGW',d:'MME'})]]
];
M.srvcc=[['Sóng LTE yếu',[X('sr1')]],['MME tách bearer',[X('sr2')]],['MSC chuẩn bị',[X('sr3')]],['MSC gửi INVITE',[X('sr4')]],['Lệnh chuyển giao',[X('sr5')]],['Cuộc gọi tiếp tục',[X('sr6')]],['Dọn dẹp phía LTE',[X('sr7')]]];
P.MAP=M;
})();

/* ===== Dựng gói, hiển thị kiểu Wireshark, tải .pcap ===== */
(function(){
var P=window.__PCAP;if(!P||window.pcapPanel)return;
var N=P.N,cat=P.cat,by=P.by,be=P.be,str=P.str,M=P.MAP;
N.MSC={n:'MSC Server',v4:'10.40.0.1'};N.RNC={n:'RNC/BSC',v4:'10.40.0.2'};N.ATCF={n:'ATCF',v4:'10.30.6.1'};
M.srvcc=[['Đang gọi VoLTE',[{k:'rtp',n:3,o:{}}]],['Sóng LTE yếu',[P_X('sr1','ENB1','MME')]],['MME tách bearer',[P_X('sr2','MME','MSC')]],['MSC chuẩn bị',[P_X('sr3','MSC','RNC')]],['MSC gửi INVITE',[P_X('sr4','MSC','ATCF')]],['Lệnh chuyển giao',[P_X('sr5','ENB1','UEA')]],['Cuộc gọi tiếp tục',[P_X('sr6','UEA','RNC')]],['Dọn dẹp phía LTE',[P_X('sr7','MME','SGW')]]];
function P_X(id,s,d){return {k:'asn',id:id,o:{s:s,d:d}};}
var TSN=1,TAG=0x4f2a1c00;
function hx2(n){return (n<16?'0':'')+n.toString(16);}
function macS(b,o){var s=[];for(var i=0;i<6;i++)s.push(hx2(b[o+i]));return s.join(':');}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
/* ----- cây SIP từ văn bản ----- */
function sipTree(text){
 var parts=text.split('\r\n\r\n'),hd=parts[0].split('\r\n'),body=parts.slice(1).join('\r\n\r\n');
 var t=['Session Initiation Protocol ('+(/^SIP\/2\.0/.test(hd[0])?hd[0].replace('SIP/2.0 ',''):hd[0].split(' ')[0])+')'];
 t.push([(/^SIP\/2\.0/.test(hd[0])?'Status-Line: ':'Request-Line: ')+hd[0]]);
 var mh=['Message Header'];hd.slice(1).forEach(function(l){mh.push(l);});t.push(mh);
 if(body.trim()){var ct=['Message Body','Session Description Protocol'];body.trim().split('\r\n').forEach(function(l){ct.push(l);});t.push([ct[0],[ct[1]].concat(ct.slice(2))]);}
 return t;}
function sipInfo(text){var f=text.split('\r\n')[0];if(/^SIP\/2\.0/.test(f)){var cs=(text.match(/CSeq: \d+ (\w+)/)||[])[1];return 'Status: '+f.replace('SIP/2.0 ','')+' ('+cs+')';}return 'Request: '+f.replace(' SIP/2.0','').replace(';user=phone','');}
/* ----- dựng một gói ----- */
function wrap(ip,l4,proto,s,d,pl){
 var f=P.frame(ip[0],ip[1],proto,l4,[N[s].n,N[d].n]);return f;}
function layers(no,f,s,d,l4n,sp,dp,plen){
 var v6=f[12]===0x86,ipo=14,src,dst,i,a=[];
 if(v6){a=[];for(i=0;i<16;i+=2)a.push(((f[22+i]<<8)|f[23+i]).toString(16));src=a.join(':').replace(/(^|:)0(:0)+(:|$)/,'::');a=[];for(i=0;i<16;i+=2)a.push(((f[38+i]<<8)|f[39+i]).toString(16));dst=a.join(':').replace(/(^|:)0(:0)+(:|$)/,'::');}
 else{src=Array.prototype.slice.call(f,26,30).join('.');dst=Array.prototype.slice.call(f,30,34).join('.');}
 return ['Frame '+no+': '+f.length+' byte trên đường dây ('+f.length*8+' bit)',
  ['Ethernet II, Src: '+macS(f,6)+' ('+N[s].n+'), Dst: '+macS(f,0)+' ('+N[d].n+')','Type: '+(v6?'IPv6 (0x86dd)':'IPv4 (0x0800)')],
  [(v6?'Internet Protocol Version 6':'Internet Protocol Version 4')+', Src: '+src+', Dst: '+dst,v6?'Hop Limit: 64':'Time to Live: 64','Giao thức tầng trên: '+l4n],
  l4n.indexOf('SCTP')===0?['Stream Control Transmission Protocol, Src Port: '+sp+', Dst Port: '+dp,'Chunk: DATA, PPID 46 (Diameter), checksum CRC32c đã tính']:['User Datagram Protocol, Src Port: '+sp+', Dst Port: '+dp,'Checksum: đã tính đúng']];}
function pk(o){return o;}
function realize(sp,def,out,ctx){
 var o=sp.k==='sip'?sp:(sp.o||{}),s=o.s||(o.r?def.d:def.s),d=o.d||(o.r?def.s:def.d),k=sp.k,ip,f,t;
 if(!s||!d||!N[s]||!N[d]){s=s||'UEA';d=d||'MME';}
 if(k==='sip'){
  var m=P.sipMsg({t:sp.t,cm:sp.cm,leg:sp.leg,snd:sp.snd,src:s,dst:d,sdp:sp.sdp,tag:sp.tag,auth:sp.auth,reason:sp.reason,x:sp.x});
  f=P.frame(m.src,m.dst,17,P.udp(m.src,m.dst,5060,5060,str(m.text)),[N[s].n,N[d].n]);
  out.push({k:'sip',s:s,d:d,proto:'SIP'+(m.sdp?'/SDP':''),info:sipInfo(m.text),f:f,app:sipTree(m.text),l4:'UDP',sp:5060,dp:5060,note:m.sdp?'':''});
 }else if(k==='dia'){
  [[sp.q,0],[sp.a,1]].forEach(function(z){if(!z[0])return;var b=P.dia(z[0],sp.q),ss=z[1]?d:s,dd=z[1]?s:d;f=P.frame(N[ss].v4,N[dd].v4,132,P.sctp(3868,3868,TAG+out.length,TSN++,46,b,0),[N[ss].n,N[dd].n]);var tr=P.diaTree(b);out.push({k:'dia',s:ss,d:dd,proto:'Diameter',info:tr[0].replace('Diameter Protocol: ','').replace(/ — .*$/,''),f:f,app:tr,l4:'SCTP',sp:3868,dp:3868});});
 }else if(k==='gtp'){
  var sq=0x2000+(P.crc32c(str(sp.q))&0xfff);
  [[sp.q,0],[sp.a,1]].forEach(function(z){if(!z[0])return;var b=P.gtp(z[0],sq),ss=z[1]?d:s,dd=z[1]?s:d;f=P.frame(N[ss].v4,N[dd].v4,17,P.udp(N[ss].v4,N[dd].v4,2123,2123,b),[N[ss].n,N[dd].n]);var tr=P.gtpTree(b);out.push({k:'gtp',s:ss,d:dd,proto:'GTPv2',info:tr[0].replace('GPRS Tunneling Protocol V2: ',''),f:f,app:tr,l4:'UDP',sp:2123,dp:2123});});
 }else if(k==='rtp'){
  var a6=N.UEA.v6,b6=N.UEB.v6;
  if(o.rtcp){var rb=P.rtcp();f=P.frame(a6,b6,17,P.udp(a6,b6,49121,50241,rb),['UE A','UE B']);out.push({k:'rtcp',s:'UEA',d:'UEB',proto:'RTCP',info:'Sender Report + Source Description',f:f,app:P.rtcpTree(rb),l4:'UDP',sp:49121,dp:50241});}
  else for(var i=0;i<sp.n;i++){
   var rp=P.rtpPkt(i,0x5a3c9e01,i===0);f=P.frame(a6,b6,17,P.udp(a6,b6,49120,50240,rp),['UE A','UE B']);out.push({k:'rtp',s:'UEA',d:'UEB',proto:'RTP',info:'PT=AMR-WB (104), SSRC=0x5a3c9e01, Seq='+(0x1a40+i)+', Time='+(0x00a01000+i*320),f:f,app:P.rtpTree(rp),l4:'UDP',sp:49120,dp:50240});
   if(!o.oneway){var rq=P.rtpPkt(i,0x7b1d4402,i===0);f=P.frame(b6,a6,17,P.udp(b6,a6,50240,49120,rq),['UE B','UE A']);out.push({k:'rtp',s:'UEB',d:'UEA',proto:'RTP',info:'PT=AMR-WB (104), SSRC=0x7b1d4402, Seq='+(0x1a40+i)+', Time='+(0x00a01000+i*320),f:f,app:P.rtpTree(rq),l4:'UDP',sp:50240,dp:49120});}
  }
 }else if(k==='asn'){
  var T=P.TR[sp.id];if(!T)return;
  var tp={s1c:'S1AP trên SCTP cổng 36412 (PPID 18), giữa eNB và MME',x2:'X2AP trên SCTP cổng 36422 (PPID 27), giữa hai eNB',uu:'Giao diện vô tuyến Uu (RRC/MAC), không đi qua IP',gtp:'GTPv2-C (UDP 2123)',int:'Nội bộ nút mạng',mix:'DNS/Diameter/SIP (xem các gói kèm theo)',isup:'ISUP trên SIGTRAN (M3UA/SCTP)',media:'Kênh thoại chuyển mạch kênh'}[T[2]]||'';
  out.push({k:'asn',s:s,d:d,proto:T[0],info:T[1],f:null,app:T[3],tp:tp,none:T[2]==='int'});
 }
}
function matchLabel(e,lbl){return lbl.indexOf(e)===0||e.indexOf(lbl)===0;}
function guess(lbl,kind,def,out){
 var m,re=/\b(REGISTER|INVITE|PRACK|UPDATE|ACK|BYE|CANCEL|\d{3})\b/g,seen=0;
 if(kind==='sip'){while((m=re.exec(lbl))){var t=m[1],resp=/^\d/.test(t);realize(resp?{k:'sip',t:t,cm:'INVITE',leg:'A',tag:true}:{k:'sip',t:t,leg:'A'},def,out);seen++;}}
 if(!seen)out.push({k:'asn',s:def.s,d:def.d,proto:'—',info:lbl,f:null,app:['Bước "'+lbl+'" chưa có mẫu bản tin chi tiết trong bộ này.'],tp:''});
}
function stepPkts(flow,i,labelOf,kindOf,defOf,n,used){
 var arr=M[flow]||[],lbl=labelOf(i),e=arr[i]&&matchLabel(arr[i][0],lbl)?arr[i]:null,j;
 if(!e)for(j=0;j<arr.length;j++)if(!used[j]&&matchLabel(arr[j][0],lbl)){e=arr[j];used[j]=1;break;}
 var out=[],def=defOf(i);
 if(e)e[1].forEach(function(sp){realize(sp,def,out);});else guess(lbl,kindOf(i),def,out);
 return out;}
/* ----- ngữ cảnh luồng ----- */
function flowId(ik){if(ik==='crbt')return S.voCrbt==='ok'?'crbtok':'crbt';if(ik==='rel')return 'rel'+S.voRel;if(ik==='full')return 'full';return ik;}
function ctxOf(ik,cols,steps,isFlow){
 var fid=flowId(ik);
 if(isFlow)return {fid:fid,n:steps.length,label:function(i){return steps[i][2];},kind:function(){return 'sip';},def:function(i){return {s:'UEA',d:'MME'};}};
 return {fid:fid,n:steps.length,label:function(i){return steps[i].s||'';},kind:function(i){return steps[i].k;},def:function(i){var st=steps[i];return {s:P.NAMEKEY[cols[st.f]],d:P.NAMEKEY[cols[st.t]]};}};
}
function allPkts(c){var res=[],used={};for(var i=0;i<c.n;i++){var a=stepPkts(c.fid,i,c.label,c.kind,c.def,c.n,used);a.forEach(function(x){x.step=i;});res=res.concat(a);}return res;}
/* ----- pcap ----- */
function le(v,n){var o=[];for(var k=0;k<n;k++)o.push((v>>>(8*k))&255);return by(o);}
function pcapFile(list){var parts=[by([0xd4,0xc3,0xb2,0xa1,2,0,4,0,0,0,0,0,0,0,0,0,0xff,0xff,0,0,1,0,0,0])],t=0;
 list.forEach(function(x,i){if(!x.f)return;var us=(i*8000+(x.step||0)*20000),sec=1760000000+Math.floor(us/1e6);parts.push(cat(le(sec,4),le(us%1e6,4),le(x.f.length,4),le(x.f.length,4),x.f));});
 return cat.apply(null,parts);}
function dl(name,list){var b=pcapFile(list),u=URL.createObjectURL(new Blob([b],{type:'application/vnd.tcpdump.pcap'})),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove();},800);}
/* ----- HTML ----- */
function treeH(t,open){if(typeof t==='string')return '<div class="gqpl">'+esc(t)+'</div>';var h='<details'+(open?' open':'')+'><summary>'+esc(t[0])+'</summary>';for(var i=1;i<t.length;i++)h+=treeH(t[i]);return h+'</details>';}
var CUR={};
function pcapPanel(k,it,i,cols,steps,st){
 try{
 var ik=S[k+'I'],isFlow=it.kind==='flow',c=ctxOf(ik,cols,steps,isFlow);
 var used={},list=stepPkts(c.fid,i,c.label,c.kind,c.def,c.n,used);
 CUR={c:c,list:list,i:i,ik:ik};
 var hasHex=list.filter(function(x){return x.f;}).length,total=list.length;
 var h='<h3>Bản tin chuẩn (kiểu pcap) · '+total+' gói ở bước này</h3><div class="gqpc">';
 h+='<p class="gqpn">Bản mô phỏng do ứng dụng dựng theo đúng khuôn của chuẩn. SIP ở giao diện Gm thực tế được IPsec mã hoá, ở đây hiển thị bản đã giải mã (UDP 5060). Diameter/GTPv2/RTP/RTCP có hex byte-chính-xác, tải về mở được bằng Wireshark. S1AP, NAS, RRC, X2AP dùng mã hoá ASN.1 PER nên chỉ hiển thị cây giải mã, không có hex. Địa chỉ, số thuê bao, khoá là giá trị ví dụ.</p>';
 h+='<div class="gqpb">'+(hasHex?'<button type="button" data-gqpc="step">Tải .pcap bước này</button>':'')+'<button type="button" data-gqpc="flow">Tải .pcap cả luồng</button></div>';
 if(!total)h+='<p class="gqpn">Bước này không phát sinh bản tin trên dây.</p>';
 list.forEach(function(x,n){
  var head='<span class="gqpr">'+(n+1)+'</span> <b>'+esc(N[x.s]?N[x.s].n:x.s)+' → '+esc(N[x.d]?N[x.d].n:x.d)+'</b> <span class="gqpp gqp-'+x.k+'">'+esc(x.proto)+'</span> '+esc(x.info);
  h+='<details class="gqpk"><summary>'+head+'</summary>';
  if(x.f){h+='<div class="gqpt">'+treeH(layers(n+1,x.f,x.s,x.d,x.l4==='SCTP'?'SCTP (132)':'UDP (17)',x.sp,x.dp,0),0)+treeH(x.app,1)+'</div><pre class="gqhx">'+esc(P.hexdump(x.f))+'</pre><div class="gqpb"><button type="button" data-gqpc="p'+n+'">Tải gói này (.pcap)</button></div>';}
  else{h+='<div class="gqpt"><div class="gqpl"><b>Truyền tải:</b> '+esc(x.tp||'')+'</div>'+treeH(x.app,1).replace(/<details open>/,'<details open>')+'<div class="gqpl gqpd">Chỉ giải mã, không sinh hex (ASN.1 PER / sự kiện nội bộ).</div></div>';}
  h+='</details>';});
 return h+'</div>';
 }catch(e){return '<!-- pcap: '+esc(e.message)+' -->';}
}
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-gqpc]');if(!b)return;var w=b.getAttribute('data-gqpc');
 if(w==='step')dl('volte-'+CUR.c.fid+'-buoc'+(CUR.i+1)+'.pcap',CUR.list);
 else if(w==='flow'){var a=allPkts(CUR.c);dl('volte-'+CUR.c.fid+'-tat-ca.pcap',a);}
 else if(w[0]==='p'){var x=CUR.list[+w.slice(1)];if(x)dl('volte-'+CUR.c.fid+'-buoc'+(CUR.i+1)+'-goi'+(+w.slice(1)+1)+'.pcap',[x]);}
});
window.pcapPanel=pcapPanel;P.allPkts=allPkts;P.ctxOf=ctxOf;P.pcapFile=pcapFile;P.stepPkts=stepPkts;
})();

