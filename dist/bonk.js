"use strict";(()=>{var qr=Object.create;var Le=Object.defineProperty;var Yr=Object.getOwnPropertyDescriptor;var Qr=Object.getOwnPropertyNames;var Wr=Object.getPrototypeOf,Xr=Object.prototype.hasOwnProperty;var Zr=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),le=(t,e)=>{for(var r in e)Le(t,r,{get:e[r],enumerable:!0})},en=(t,e,r,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Qr(e))!Xr.call(t,i)&&i!==r&&Le(t,i,{get:()=>e[i],enumerable:!(n=Yr(e,i))||n.enumerable});return t};var er=(t,e,r)=>(r=t!=null?qr(Wr(t)):{},en(e||!t||!t.__esModule?Le(r,"default",{value:t,enumerable:!0}):r,t));var gt=Zr((vo,mt)=>{"use strict";var f={};f.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)};f.localCName=f.generateIdentifier();f.splitLines=function(t){return t.trim().split(`
`).map(e=>e.trim())};f.splitSections=function(t){return t.split(`
m=`).map((r,n)=>(n>0?"m="+r:r).trim()+`\r
`)};f.getDescription=function(t){let e=f.splitSections(t);return e&&e[0]};f.getMediaSections=function(t){let e=f.splitSections(t);return e.shift(),e};f.matchPrefix=function(t,e){return f.splitLines(t).filter(r=>r.indexOf(e)===0)};f.parseCandidate=function(t){let e;t.indexOf("a=candidate:")===0?e=t.substring(12).split(" "):e=t.substring(10).split(" ");let r={foundation:e[0],component:{1:"rtp",2:"rtcp"}[e[1]]||e[1],protocol:e[2].toLowerCase(),priority:parseInt(e[3],10),ip:e[4],address:e[4],port:parseInt(e[5],10),type:e[7]};for(let n=8;n<e.length;n+=2)switch(e[n]){case"raddr":r.relatedAddress=e[n+1];break;case"rport":r.relatedPort=parseInt(e[n+1],10);break;case"tcptype":r.tcpType=e[n+1];break;case"ufrag":r.ufrag=e[n+1],r.usernameFragment=e[n+1];break;default:r[e[n]]===void 0&&(r[e[n]]=e[n+1]);break}return r};f.writeCandidate=function(t){let e=[];e.push(t.foundation);let r=t.component;r==="rtp"?e.push(1):r==="rtcp"?e.push(2):e.push(r),e.push(t.protocol.toUpperCase()),e.push(t.priority),e.push(t.address||t.ip),e.push(t.port);let n=t.type;return e.push("typ"),e.push(n),n!=="host"&&t.relatedAddress&&t.relatedPort!==void 0&&(e.push("raddr"),e.push(t.relatedAddress),e.push("rport"),e.push(t.relatedPort)),t.tcpType&&t.protocol.toLowerCase()==="tcp"&&(e.push("tcptype"),e.push(t.tcpType)),(t.usernameFragment||t.ufrag)&&(e.push("ufrag"),e.push(t.usernameFragment||t.ufrag)),"candidate:"+e.join(" ")};f.parseIceOptions=function(t){return t.substring(14).split(" ")};f.parseRtpMap=function(t){let e=t.substring(9).split(" "),r={payloadType:parseInt(e.shift(),10)};return e=e[0].split("/"),r.name=e[0],r.clockRate=parseInt(e[1],10),r.channels=e.length===3?parseInt(e[2],10):1,r.numChannels=r.channels,r};f.writeRtpMap=function(t){let e=t.payloadType;t.preferredPayloadType!==void 0&&(e=t.preferredPayloadType);let r=t.channels||t.numChannels||1;return"a=rtpmap:"+e+" "+t.name+"/"+t.clockRate+(r!==1?"/"+r:"")+`\r
`};f.parseExtmap=function(t){let e=t.substring(9).split(" ");return{id:parseInt(e[0],10),direction:e[0].indexOf("/")>0?e[0].split("/")[1]:"sendrecv",uri:e[1],attributes:e.slice(2).join(" ")}};f.writeExtmap=function(t){return"a=extmap:"+(t.id||t.preferredId)+(t.direction&&t.direction!=="sendrecv"?"/"+t.direction:"")+" "+t.uri+(t.attributes?" "+t.attributes:"")+`\r
`};f.parseFmtp=function(t){let e={},r=t.substring(t.indexOf(" ")+1).split(";");for(let n=0;n<r.length;n++){let[i,...s]=r[n].trim().split("=");e[i.trim()]=s.length?s.join("="):void 0}return e};f.writeFmtp=function(t){let e="",r=t.payloadType;if(t.preferredPayloadType!==void 0&&(r=t.preferredPayloadType),t.parameters&&Object.keys(t.parameters).length){let n=[];Object.keys(t.parameters).forEach(i=>{t.parameters[i]!==void 0?n.push(i+"="+t.parameters[i]):n.push(i)}),e+="a=fmtp:"+r+" "+n.join(";")+`\r
`}return e};f.parseRtcpFb=function(t){let e=t.substring(t.indexOf(" ")+1).split(" ");return{type:e.shift(),parameter:e.join(" ")}};f.writeRtcpFb=function(t){let e="",r=t.payloadType;return t.preferredPayloadType!==void 0&&(r=t.preferredPayloadType),t.rtcpFeedback&&t.rtcpFeedback.length&&t.rtcpFeedback.forEach(n=>{e+="a=rtcp-fb:"+r+" "+n.type+(n.parameter&&n.parameter.length?" "+n.parameter:"")+`\r
`}),e};f.parseSsrcMedia=function(t){let e=t.indexOf(" "),r={ssrc:parseInt(t.substring(7,e),10)},n=t.indexOf(":",e);return n>-1?(r.attribute=t.substring(e+1,n),r.value=t.substring(n+1)):r.attribute=t.substring(e+1),r};f.parseSsrcGroup=function(t){let e=t.substring(13).split(" ");return{semantics:e.shift(),ssrcs:e.map(r=>parseInt(r,10))}};f.getMid=function(t){let e=f.matchPrefix(t,"a=mid:")[0];if(e)return e.substring(6)};f.parseFingerprint=function(t){let e=t.substring(14).split(" ");return{algorithm:e[0].toLowerCase(),value:e[1].toUpperCase()}};f.getDtlsParameters=function(t,e){return{role:"auto",fingerprints:f.matchPrefix(t+e,"a=fingerprint:").map(f.parseFingerprint)}};f.writeDtlsParameters=function(t,e){let r="a=setup:"+e+`\r
`;return t.fingerprints.forEach(n=>{r+="a=fingerprint:"+n.algorithm+" "+n.value+`\r
`}),r};f.parseCryptoLine=function(t){let e=t.substring(9).split(" ");return{tag:parseInt(e[0],10),cryptoSuite:e[1],keyParams:e[2],sessionParams:e.slice(3)}};f.writeCryptoLine=function(t){return"a=crypto:"+t.tag+" "+t.cryptoSuite+" "+(typeof t.keyParams=="object"?f.writeCryptoKeyParams(t.keyParams):t.keyParams)+(t.sessionParams?" "+t.sessionParams.join(" "):"")+`\r
`};f.parseCryptoKeyParams=function(t){if(t.indexOf("inline:")!==0)return null;let e=t.substring(7).split("|");return{keyMethod:"inline",keySalt:e[0],lifeTime:e[1],mkiValue:e[2]?e[2].split(":")[0]:void 0,mkiLength:e[2]?e[2].split(":")[1]:void 0}};f.writeCryptoKeyParams=function(t){return t.keyMethod+":"+t.keySalt+(t.lifeTime?"|"+t.lifeTime:"")+(t.mkiValue&&t.mkiLength?"|"+t.mkiValue+":"+t.mkiLength:"")};f.getCryptoParameters=function(t,e){return f.matchPrefix(t+e,"a=crypto:").map(f.parseCryptoLine)};f.getIceParameters=function(t,e){let r=f.matchPrefix(t+e,"a=ice-ufrag:")[0],n=f.matchPrefix(t+e,"a=ice-pwd:")[0];return r&&n?{usernameFragment:r.substring(12),password:n.substring(10)}:null};f.writeIceParameters=function(t){let e="a=ice-ufrag:"+t.usernameFragment+`\r
a=ice-pwd:`+t.password+`\r
`;return t.iceLite&&(e+=`a=ice-lite\r
`),e};f.parseRtpParameters=function(t){let e={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=f.splitLines(t)[0].split(" ");e.profile=n[2];for(let s=3;s<n.length;s++){let a=n[s],c=f.matchPrefix(t,"a=rtpmap:"+a+" ")[0];if(c){let l=f.parseRtpMap(c),u=f.matchPrefix(t,"a=fmtp:"+a+" ");switch(l.parameters=u.length?f.parseFmtp(u[0]):{},l.rtcpFeedback=f.matchPrefix(t,"a=rtcp-fb:"+a+" ").map(f.parseRtcpFb),e.codecs.push(l),l.name.toUpperCase()){case"RED":case"ULPFEC":e.fecMechanisms.push(l.name.toUpperCase());break;default:break}}}f.matchPrefix(t,"a=extmap:").forEach(s=>{e.headerExtensions.push(f.parseExtmap(s))});let i=f.matchPrefix(t,"a=rtcp-fb:* ").map(f.parseRtcpFb);return e.codecs.forEach(s=>{i.forEach(a=>{s.rtcpFeedback.find(l=>l.type===a.type&&l.parameter===a.parameter)||s.rtcpFeedback.push(a)})}),e};f.writeRtpDescription=function(t,e){let r="";r+="m="+t+" ",r+=e.codecs.length>0?"9":"0",r+=" "+(e.profile||"UDP/TLS/RTP/SAVPF")+" ",r+=e.codecs.map(i=>i.preferredPayloadType!==void 0?i.preferredPayloadType:i.payloadType).join(" ")+`\r
`,r+=`c=IN IP4 0.0.0.0\r
`,r+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,e.codecs.forEach(i=>{r+=f.writeRtpMap(i),r+=f.writeFmtp(i),r+=f.writeRtcpFb(i)});let n=0;return e.codecs.forEach(i=>{i.maxptime>n&&(n=i.maxptime)}),n>0&&(r+="a=maxptime:"+n+`\r
`),e.headerExtensions&&e.headerExtensions.forEach(i=>{r+=f.writeExtmap(i)}),r};f.parseRtpEncodingParameters=function(t){let e=[],r=f.parseRtpParameters(t),n=r.fecMechanisms.indexOf("RED")!==-1,i=r.fecMechanisms.indexOf("ULPFEC")!==-1,s=f.matchPrefix(t,"a=ssrc:").map(d=>f.parseSsrcMedia(d)).filter(d=>d.attribute==="cname"),a=s.length>0&&s[0].ssrc,c,l=f.matchPrefix(t,"a=ssrc-group:FID").map(d=>d.substring(17).split(" ").map(m=>parseInt(m,10)));l.length>0&&l[0].length>1&&l[0][0]===a&&(c=l[0][1]),r.codecs.forEach(d=>{if(d.name.toUpperCase()==="RTX"&&d.parameters.apt){let p={ssrc:a,codecPayloadType:parseInt(d.parameters.apt,10)};a&&c&&(p.rtx={ssrc:c}),e.push(p),n&&(p=JSON.parse(JSON.stringify(p)),p.fec={ssrc:a,mechanism:i?"red+ulpfec":"red"},e.push(p))}}),e.length===0&&a&&e.push({ssrc:a});let u=f.matchPrefix(t,"b=");return u.length&&(u[0].indexOf("b=TIAS:")===0?u=parseInt(u[0].substring(7),10):u[0].indexOf("b=AS:")===0?u=parseInt(u[0].substring(5),10)*1e3*.95-50*40*8:u=void 0,e.forEach(d=>{d.maxBitrate=u})),e};f.parseRtcpParameters=function(t){let e={},r=f.matchPrefix(t,"a=ssrc:").map(s=>f.parseSsrcMedia(s)).filter(s=>s.attribute==="cname")[0];r&&(e.cname=r.value,e.ssrc=r.ssrc);let n=f.matchPrefix(t,"a=rtcp-rsize");e.reducedSize=n.length>0,e.compound=n.length===0;let i=f.matchPrefix(t,"a=rtcp-mux");return e.mux=i.length>0,e};f.writeRtcpParameters=function(t){let e="";return t.reducedSize&&(e+=`a=rtcp-rsize\r
`),t.mux&&(e+=`a=rtcp-mux\r
`),t.ssrc!==void 0&&t.cname&&(e+="a=ssrc:"+t.ssrc+" cname:"+t.cname+`\r
`),e};f.parseMsid=function(t){let e,r=f.matchPrefix(t,"a=msid:");if(r.length===1)return e=r[0].substring(7).split(" "),{stream:e[0],track:e[1]};let n=f.matchPrefix(t,"a=ssrc:").map(i=>f.parseSsrcMedia(i)).filter(i=>i.attribute==="msid");if(n.length>0)return e=n[0].value.split(" "),{stream:e[0],track:e[1]}};f.parseSctpDescription=function(t){let e=f.parseMLine(t),r=f.matchPrefix(t,"a=max-message-size:"),n;r.length>0&&(n=parseInt(r[0].substring(19),10)),isNaN(n)&&(n=65536);let i=f.matchPrefix(t,"a=sctp-port:");if(i.length>0)return{port:parseInt(i[0].substring(12),10),protocol:e.fmt,maxMessageSize:n};let s=f.matchPrefix(t,"a=sctpmap:");if(s.length>0){let a=s[0].substring(10).split(" ");return{port:parseInt(a[0],10),protocol:a[1],maxMessageSize:n}}};f.writeSctpDescription=function(t,e){let r=[];return t.protocol!=="DTLS/SCTP"?r=["m="+t.kind+" 9 "+t.protocol+" "+e.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+e.port+`\r
`]:r=["m="+t.kind+" 9 "+t.protocol+" "+e.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+e.port+" "+e.protocol+` 65535\r
`],e.maxMessageSize!==void 0&&r.push("a=max-message-size:"+e.maxMessageSize+`\r
`),r.join("")};f.generateSessionId=function(){return Math.random().toString().substr(2,22)};f.writeSessionBoilerplate=function(t,e,r){let n,i=e!==void 0?e:2;return t?n=t:n=f.generateSessionId(),`v=0\r
o=`+(r||"thisisadapterortc")+" "+n+" "+i+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`};f.getDirection=function(t,e){let r=f.splitLines(t);for(let n=0;n<r.length;n++)switch(r[n]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return r[n].substring(2);default:}return e?f.getDirection(e):"sendrecv"};f.getKind=function(t){return f.splitLines(t)[0].split(" ")[0].substring(2)};f.isRejected=function(t){return t.split(" ",2)[1]==="0"};f.parseMLine=function(t){let r=f.splitLines(t)[0].substring(2).split(" ");return{kind:r[0],port:parseInt(r[1],10),protocol:r[2],fmt:r.slice(3).join(" ")}};f.parseOLine=function(t){let r=f.matchPrefix(t,"o=")[0].substring(2).split(" ");return{username:r[0],sessionId:r[1],sessionVersion:parseInt(r[2],10),netType:r[3],addressType:r[4],address:r[5]}};f.isValidSDP=function(t){if(typeof t!="string"||t.length===0)return!1;let e=f.splitLines(t);for(let r=0;r<e.length;r++)if(e[r].length<2||e[r].charAt(1)!=="=")return!1;return!0};typeof mt=="object"&&(mt.exports=f)});var je=class{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){let e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){let e=[];for(let r of this._parts)e.push(r);return tn(e).buffer}};function tn(t){let e=0;for(let i of t)e+=i.byteLength;let r=new Uint8Array(e),n=0;for(let i of t){let s=new Uint8Array(i.buffer,i.byteOffset,i.byteLength);r.set(s,n),n+=i.byteLength}return r}function Ne(t){return new Be(t).unpack()}function ze(t){let e=new Ue,r=e.pack(t);return r instanceof Promise?r.then(()=>e.getBuffer()):e.getBuffer()}var Be=class{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){let e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let r;if((r=e^160)<=15)return this.unpack_raw(r);if((r=e^176)<=15)return this.unpack_string(r);if((r=e^144)<=15)return this.unpack_array(r);if((r=e^128)<=15)return this.unpack_map(r);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return r=this.unpack_uint16(),this.unpack_string(r);case 217:return r=this.unpack_uint32(),this.unpack_string(r);case 218:return r=this.unpack_uint16(),this.unpack_raw(r);case 219:return r=this.unpack_uint32(),this.unpack_raw(r);case 220:return r=this.unpack_uint16(),this.unpack_array(r);case 221:return r=this.unpack_uint32(),this.unpack_array(r);case 222:return r=this.unpack_uint16(),this.unpack_map(r);case 223:return r=this.unpack_uint32(),this.unpack_map(r)}}unpack_uint8(){let e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){let e=this.read(2),r=(e[0]&255)*256+(e[1]&255);return this.index+=2,r}unpack_uint32(){let e=this.read(4),r=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,r}unpack_uint64(){let e=this.read(8),r=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,r}unpack_int8(){let e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){let e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){let e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){let e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);let r=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,r}unpack_string(e){let r=this.read(e),n=0,i="",s,a;for(;n<e;)s=r[n],s<160?(a=s,n++):(s^192)<32?(a=(s&31)<<6|r[n+1]&63,n+=2):(s^224)<16?(a=(s&15)<<12|(r[n+1]&63)<<6|r[n+2]&63,n+=3):(a=(s&7)<<18|(r[n+1]&63)<<12|(r[n+2]&63)<<6|r[n+3]&63,n+=4),i+=String.fromCodePoint(a);return this.index+=e,i}unpack_array(e){let r=new Array(e);for(let n=0;n<e;n++)r[n]=this.unpack();return r}unpack_map(e){let r={};for(let n=0;n<e;n++){let i=this.unpack();r[i]=this.unpack()}return r}unpack_float(){let e=this.unpack_uint32(),r=e>>31,n=(e>>23&255)-127,i=e&8388607|8388608;return(r===0?1:-1)*i*2**(n-23)}unpack_double(){let e=this.unpack_uint32(),r=this.unpack_uint32(),n=e>>31,i=(e>>20&2047)-1023,a=(e&1048575|1048576)*2**(i-20)+r*2**(i-52);return(n===0?1:-1)*a}read(e){let r=this.index;if(r+e<=this.length)return this.dataView.subarray(r,r+e);throw new Error("BinaryPackFailure: read index out of range")}},Ue=class{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{let r=e.constructor;if(e instanceof Array){let n=this.pack_array(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){let n=e;this.pack_bin(new Uint8Array(n.buffer,n.byteOffset,n.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(n=>{this.pack_bin(new Uint8Array(n)),this._bufferBuilder.flush()});if(r==Object||r.toString().startsWith("class")){let n=this.pack_object(e);if(n instanceof Promise)return n.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${r.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){let r=e.length;if(r<=15)this.pack_uint8(160+r);else if(r<=65535)this._bufferBuilder.append(218),this.pack_uint16(r);else if(r<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(r);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){let r=this._textEncoder.encode(e),n=r.length;if(n<=15)this.pack_uint8(176+n);else if(n<=65535)this._bufferBuilder.append(216),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(n);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(r)}pack_array(e){let r=e.length;if(r<=15)this.pack_uint8(144+r);else if(r<=65535)this._bufferBuilder.append(220),this.pack_uint16(r);else if(r<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(r);else throw new Error("Invalid length");let n=i=>{if(i<r){let s=this.pack(e[i]);return s instanceof Promise?s.then(()=>n(i+1)):n(i+1)}};return n(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let r=0;e<0&&(r=1,e=-e);let n=Math.floor(Math.log(e)/Math.LN2),i=e/2**n-1,s=Math.floor(i*2**52),a=2**32,c=r<<31|n+1023<<20|s/a&1048575,l=s%a;this._bufferBuilder.append(203),this.pack_int32(c),this.pack_int32(l)}pack_object(e){let r=Object.keys(e),n=r.length;if(n<=15)this.pack_uint8(128+n);else if(n<=65535)this._bufferBuilder.append(222),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(n);else throw new Error("Invalid length");let i=s=>{if(s<r.length){let a=r[s];if(e.hasOwnProperty(a)){this.pack(a);let c=this.pack(e[a]);if(c instanceof Promise)return c.then(()=>i(s+1))}return i(s+1)}};return i(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){let r=e&4294967295;this._bufferBuilder.append((r&4278190080)>>>24),this._bufferBuilder.append((r&16711680)>>>16),this._bufferBuilder.append((r&65280)>>>8),this._bufferBuilder.append(r&255)}pack_uint64(e){let r=e/4294967296,n=e%2**32;this._bufferBuilder.append((r&4278190080)>>>24),this._bufferBuilder.append((r&16711680)>>>16),this._bufferBuilder.append((r&65280)>>>8),this._bufferBuilder.append(r&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){let r=Math.floor(e/4294967296),n=e%2**32;this._bufferBuilder.append((r&4278190080)>>>24),this._bufferBuilder.append((r&16711680)>>>16),this._bufferBuilder.append((r&65280)>>>8),this._bufferBuilder.append(r&255),this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}constructor(){this._bufferBuilder=new je,this._textEncoder=new TextEncoder}};var rr=!0,nr=!0;function K(t,e,r){let n=t.match(e);return n&&n.length>=r&&parseFloat(n[r],10)}function A(t,e,r){if(!t.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){W("Unable to polyfill events");return}let i=t.RTCPeerConnection.prototype,s=i.addEventListener;i.addEventListener=function(c,l){if(c!==e)return s.apply(this,arguments);let u=d=>{let p=r(d);p&&(l.handleEvent?l.handleEvent(p):l(p))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(l,u),s.apply(this,[c,u])};let a=i.removeEventListener;i.removeEventListener=function(c,l){if(c!==e||!this._eventMap||!this._eventMap[e])return a.apply(this,arguments);if(!this._eventMap[e].has(l))return a.apply(this,arguments);let u=this._eventMap[e].get(l);return this._eventMap[e].delete(l),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,a.apply(this,[c,u])},Object.defineProperty(i,"on"+e,{get(){return this["_on"+e]},set(c){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),c&&this.addEventListener(e,this["_on"+e]=c)},enumerable:!0,configurable:!0})}function or(t){return typeof t!="boolean"?new Error("Argument type: "+typeof t+". Please use a boolean."):(rr=t,t?"adapter.js logging disabled":"adapter.js logging enabled")}function ir(t){return typeof t!="boolean"?new Error("Argument type: "+typeof t+". Please use a boolean."):(nr=!t,"adapter.js deprecation warnings "+(t?"disabled":"enabled"))}function W(){if(typeof window=="object"){if(rr)return;typeof console<"u"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function V(t,e){nr&&console.warn(t+" is deprecated, please use "+e+" instead.")}function sr(t){let e={browser:null,version:null};if(typeof t>"u"||!t.navigator||!t.navigator.userAgent)return e.browser="Not a browser.",e;let{navigator:r}=t;if(r.userAgentData&&r.userAgentData.brands){let n=r.userAgentData.brands.find(i=>i.brand==="Chromium");if(n){let i=parseInt(n.version,10);if(i>=90)return{browser:"chrome",version:i}}}if(r.mozGetUserMedia)e.browser="firefox",e.version=parseInt(K(r.userAgent,/Firefox\/(\d+)\./,1));else if(r.webkitGetUserMedia||t.isSecureContext===!1&&t.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(K(r.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(t.RTCPeerConnection&&r.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(K(r.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=t.RTCRtpTransceiver&&"currentDirection"in t.RTCRtpTransceiver.prototype,e._safariVersion=K(r.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function tr(t){return Object.prototype.toString.call(t)==="[object Object]"}function Je(t){return tr(t)?Object.keys(t).reduce(function(e,r){let n=tr(t[r]),i=n?Je(t[r]):t[r],s=n&&!Object.keys(i).length;return i===void 0||s?e:Object.assign(e,{[r]:i})},{}):t}function Fe(t,e,r){!e||r.has(e.id)||(r.set(e.id,e),Object.keys(e).forEach(n=>{n.endsWith("Id")?Fe(t,t.get(e[n]),r):n.endsWith("Ids")&&e[n].forEach(i=>{Fe(t,t.get(i),r)})}))}function Ge(t,e,r){let n=r?"outbound-rtp":"inbound-rtp",i=new Map;if(e===null)return i;let s=[];return t.forEach(a=>{a.type==="track"&&a.trackIdentifier===e.id&&s.push(a)}),s.forEach(a=>{t.forEach(c=>{c.type===n&&c.trackId===a.id&&Fe(t,c,i)})}),i}var pe={};le(pe,{fixNegotiationNeeded:()=>Qe,shimAddTrackRemoveTrack:()=>Ye,shimAddTrackRemoveTrackWithNative:()=>cr,shimGetSendersWithDtmf:()=>Ve,shimGetUserMedia:()=>ue,shimMediaStream:()=>He,shimOnTrack:()=>Ke,shimPeerConnection:()=>de,shimSenderReceiverGetStats:()=>qe});var ar=W;function ue(t,e){if(e.version>=64)return;let r=t&&t.navigator;if(!r.mediaDevices)return;let n=function(c){if(typeof c!="object"||c.mandatory||c.optional)return c;let l={};return Object.keys(c).forEach(u=>{if(u==="require"||u==="advanced"||u==="mediaSource")return;let d=typeof c[u]=="object"?c[u]:{ideal:c[u]};d.exact!==void 0&&typeof d.exact=="number"&&(d.min=d.max=d.exact);let p=function(m,y){return m?m+y.charAt(0).toUpperCase()+y.slice(1):y==="deviceId"?"sourceId":y};if(d.ideal!==void 0){l.optional=l.optional||[];let m={};typeof d.ideal=="number"?(m[p("min",u)]=d.ideal,l.optional.push(m),m={},m[p("max",u)]=d.ideal,l.optional.push(m)):(m[p("",u)]=d.ideal,l.optional.push(m))}d.exact!==void 0&&typeof d.exact!="number"?(l.mandatory=l.mandatory||{},l.mandatory[p("",u)]=d.exact):["min","max"].forEach(m=>{d[m]!==void 0&&(l.mandatory=l.mandatory||{},l.mandatory[p(m,u)]=d[m])})}),c.advanced&&(l.optional=(l.optional||[]).concat(c.advanced)),l},i=function(c,l){if(e.version>=61)return l(c);if(c=JSON.parse(JSON.stringify(c)),c&&typeof c.audio=="object"){let u=function(d,p,m){p in d&&!(m in d)&&(d[m]=d[p],delete d[p])};c=JSON.parse(JSON.stringify(c)),u(c.audio,"autoGainControl","googAutoGainControl"),u(c.audio,"noiseSuppression","googNoiseSuppression"),c.audio=n(c.audio)}if(c&&typeof c.video=="object"){let u=c.video.facingMode;u=u&&(typeof u=="object"?u:{ideal:u});let d=e.version<66;if(u&&(u.exact==="user"||u.exact==="environment"||u.ideal==="user"||u.ideal==="environment")&&!(r.mediaDevices.getSupportedConstraints&&r.mediaDevices.getSupportedConstraints().facingMode&&!d)){delete c.video.facingMode;let p;if(u.exact==="environment"||u.ideal==="environment"?p=["back","rear"]:(u.exact==="user"||u.ideal==="user")&&(p=["front"]),p)return r.mediaDevices.enumerateDevices().then(m=>{m=m.filter(R=>R.kind==="videoinput");let y=m.find(R=>p.some(D=>R.label.toLowerCase().includes(D)));return!y&&m.length&&p.includes("back")&&(y=m[m.length-1]),y&&(c.video.deviceId=u.exact?{exact:y.deviceId}:{ideal:y.deviceId}),c.video=n(c.video),ar("chrome: "+JSON.stringify(c)),l(c)})}c.video=n(c.video)}return ar("chrome: "+JSON.stringify(c)),l(c)},s=function(c){return e.version>=64?c:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[c.name]||c.name,message:c.message,constraint:c.constraint||c.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},a=function(c,l,u){i(c,d=>{r.webkitGetUserMedia(d,l,p=>{u&&u(s(p))})})};if(r.getUserMedia=a.bind(r),r.mediaDevices.getUserMedia){let c=r.mediaDevices.getUserMedia.bind(r.mediaDevices);r.mediaDevices.getUserMedia=function(l){return i(l,u=>c(u).then(d=>{if(u.audio&&!d.getAudioTracks().length||u.video&&!d.getVideoTracks().length)throw d.getTracks().forEach(p=>{p.stop()}),new DOMException("","NotFoundError");return d},d=>Promise.reject(s(d))))}}}function He(t){t.MediaStream=t.MediaStream||t.webkitMediaStream}function Ke(t,e){if(!(e.version>102))if(typeof t=="object"&&t.RTCPeerConnection&&!("ontrack"in t.RTCPeerConnection.prototype)){Object.defineProperty(t.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(n){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=n)},enumerable:!0,configurable:!0});let r=t.RTCPeerConnection.prototype.setRemoteDescription;t.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=i=>{i.stream.addEventListener("addtrack",s=>{let a;t.RTCPeerConnection.prototype.getReceivers?a=this.getReceivers().find(l=>l.track&&l.track.id===s.track.id):a={track:s.track};let c=new Event("track");c.track=s.track,c.receiver=a,c.transceiver={receiver:a},c.streams=[i.stream],this.dispatchEvent(c)}),i.stream.getTracks().forEach(s=>{let a;t.RTCPeerConnection.prototype.getReceivers?a=this.getReceivers().find(l=>l.track&&l.track.id===s.id):a={track:s};let c=new Event("track");c.track=s,c.receiver=a,c.transceiver={receiver:a},c.streams=[i.stream],this.dispatchEvent(c)})},this.addEventListener("addstream",this._ontrackpoly)),r.apply(this,arguments)}}else A(t,"track",r=>(r.transceiver||Object.defineProperty(r,"transceiver",{value:{receiver:r.receiver}}),r))}function Ve(t){if(typeof t=="object"&&t.RTCPeerConnection&&!("getSenders"in t.RTCPeerConnection.prototype)&&"createDTMFSender"in t.RTCPeerConnection.prototype){let e=function(i,s){return{track:s,get dtmf(){return this._dtmf===void 0&&(s.kind==="audio"?this._dtmf=i.createDTMFSender(s):this._dtmf=null),this._dtmf},_pc:i}};if(!t.RTCPeerConnection.prototype.getSenders){t.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};let i=t.RTCPeerConnection.prototype.addTrack;t.RTCPeerConnection.prototype.addTrack=function(c,l){let u=i.apply(this,arguments);return u||(u=e(this,c),this._senders.push(u)),u};let s=t.RTCPeerConnection.prototype.removeTrack;t.RTCPeerConnection.prototype.removeTrack=function(c){s.apply(this,arguments);let l=this._senders.indexOf(c);l!==-1&&this._senders.splice(l,1)}}let r=t.RTCPeerConnection.prototype.addStream;t.RTCPeerConnection.prototype.addStream=function(s){this._senders=this._senders||[],r.apply(this,[s]),s.getTracks().forEach(a=>{this._senders.push(e(this,a))})};let n=t.RTCPeerConnection.prototype.removeStream;t.RTCPeerConnection.prototype.removeStream=function(s){this._senders=this._senders||[],n.apply(this,[s]),s.getTracks().forEach(a=>{let c=this._senders.find(l=>l.track===a);c&&this._senders.splice(this._senders.indexOf(c),1)})}}else if(typeof t=="object"&&t.RTCPeerConnection&&"getSenders"in t.RTCPeerConnection.prototype&&"createDTMFSender"in t.RTCPeerConnection.prototype&&t.RTCRtpSender&&!("dtmf"in t.RTCRtpSender.prototype)){let e=t.RTCPeerConnection.prototype.getSenders;t.RTCPeerConnection.prototype.getSenders=function(){let n=e.apply(this,[]);return n.forEach(i=>i._pc=this),n},Object.defineProperty(t.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function qe(t,e){if(e.version>=67||!(typeof t=="object"&&t.RTCPeerConnection&&t.RTCRtpSender&&t.RTCRtpReceiver))return;if(!("getStats"in t.RTCRtpSender.prototype)){let n=t.RTCPeerConnection.prototype.getSenders;n&&(t.RTCPeerConnection.prototype.getSenders=function(){let a=n.apply(this,[]);return a.forEach(c=>c._pc=this),a});let i=t.RTCPeerConnection.prototype.addTrack;i&&(t.RTCPeerConnection.prototype.addTrack=function(){let a=i.apply(this,arguments);return a._pc=this,a}),t.RTCRtpSender.prototype.getStats=function(){let a=this;return this._pc.getStats().then(c=>Ge(c,a.track,!0))}}if(!("getStats"in t.RTCRtpReceiver.prototype)){let n=t.RTCPeerConnection.prototype.getReceivers;n&&(t.RTCPeerConnection.prototype.getReceivers=function(){let s=n.apply(this,[]);return s.forEach(a=>a._pc=this),s}),A(t,"track",i=>(i.receiver._pc=i.srcElement,i)),t.RTCRtpReceiver.prototype.getStats=function(){let s=this;return this._pc.getStats().then(a=>Ge(a,s.track,!1))}}if(!("getStats"in t.RTCRtpSender.prototype&&"getStats"in t.RTCRtpReceiver.prototype))return;let r=t.RTCPeerConnection.prototype.getStats;t.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof t.MediaStreamTrack){let i=arguments[0],s,a,c;return this.getSenders().forEach(l=>{l.track===i&&(s?c=!0:s=l)}),this.getReceivers().forEach(l=>(l.track===i&&(a?c=!0:a=l),l.track===i)),c||s&&a?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):s?s.getStats():a?a.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return r.apply(this,arguments)}}function cr(t){t.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(a=>this._shimmedLocalStreams[a][0])};let e=t.RTCPeerConnection.prototype.addTrack;t.RTCPeerConnection.prototype.addTrack=function(a,c){if(!c)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};let l=e.apply(this,arguments);return this._shimmedLocalStreams[c.id]?this._shimmedLocalStreams[c.id].indexOf(l)===-1&&this._shimmedLocalStreams[c.id].push(l):this._shimmedLocalStreams[c.id]=[c,l],l};let r=t.RTCPeerConnection.prototype.addStream;t.RTCPeerConnection.prototype.addStream=function(a){this._shimmedLocalStreams=this._shimmedLocalStreams||{},a.getTracks().forEach(u=>{if(this.getSenders().find(p=>p.track===u))throw new DOMException("Track already exists.","InvalidAccessError")});let c=this.getSenders();r.apply(this,arguments);let l=this.getSenders().filter(u=>c.indexOf(u)===-1);this._shimmedLocalStreams[a.id]=[a].concat(l)};let n=t.RTCPeerConnection.prototype.removeStream;t.RTCPeerConnection.prototype.removeStream=function(a){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[a.id],n.apply(this,arguments)};let i=t.RTCPeerConnection.prototype.removeTrack;t.RTCPeerConnection.prototype.removeTrack=function(a){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},a&&Object.keys(this._shimmedLocalStreams).forEach(c=>{let l=this._shimmedLocalStreams[c].indexOf(a);l!==-1&&this._shimmedLocalStreams[c].splice(l,1),this._shimmedLocalStreams[c].length===1&&delete this._shimmedLocalStreams[c]}),i.apply(this,arguments)}}function Ye(t,e){if(!t.RTCPeerConnection)return;if(t.RTCPeerConnection.prototype.addTrack&&e.version>=65)return cr(t);let r=t.RTCPeerConnection.prototype.getLocalStreams;t.RTCPeerConnection.prototype.getLocalStreams=function(){let d=r.apply(this);return this._reverseStreams=this._reverseStreams||{},d.map(p=>this._reverseStreams[p.id])};let n=t.RTCPeerConnection.prototype.addStream;t.RTCPeerConnection.prototype.addStream=function(d){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},d.getTracks().forEach(p=>{if(this.getSenders().find(y=>y.track===p))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[d.id]){let p=new t.MediaStream(d.getTracks());this._streams[d.id]=p,this._reverseStreams[p.id]=d,d=p}n.apply(this,[d])};let i=t.RTCPeerConnection.prototype.removeStream;t.RTCPeerConnection.prototype.removeStream=function(d){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},i.apply(this,[this._streams[d.id]||d]),delete this._reverseStreams[this._streams[d.id]?this._streams[d.id].id:d.id],delete this._streams[d.id]},t.RTCPeerConnection.prototype.addTrack=function(d,p){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");let m=[].slice.call(arguments,1);if(m.length!==1||!m[0].getTracks().find(D=>D===d))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(D=>D.track===d))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};let R=this._streams[p.id];if(R)R.addTrack(d),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{let D=new t.MediaStream([d]);this._streams[p.id]=D,this._reverseStreams[D.id]=p,this.addStream(D)}return this.getSenders().find(D=>D.track===d)};function s(u,d){let p=d.sdp;return Object.keys(u._reverseStreams||[]).forEach(m=>{let y=u._reverseStreams[m],R=u._streams[y.id];p=p.replace(new RegExp(R.id,"g"),y.id)}),new RTCSessionDescription({type:d.type,sdp:p})}function a(u,d){let p=d.sdp;return Object.keys(u._reverseStreams||[]).forEach(m=>{let y=u._reverseStreams[m],R=u._streams[y.id];p=p.replace(new RegExp(y.id,"g"),R.id)}),new RTCSessionDescription({type:d.type,sdp:p})}["createOffer","createAnswer"].forEach(function(u){let d=t.RTCPeerConnection.prototype[u],p={[u](){let m=arguments;return arguments.length&&typeof arguments[0]=="function"?d.apply(this,[R=>{let D=s(this,R);m[0].apply(null,[D])},R=>{m[1]&&m[1].apply(null,R)},arguments[2]]):d.apply(this,arguments).then(R=>s(this,R))}};t.RTCPeerConnection.prototype[u]=p[u]});let c=t.RTCPeerConnection.prototype.setLocalDescription;t.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?c.apply(this,arguments):(arguments[0]=a(this,arguments[0]),c.apply(this,arguments))};let l=Object.getOwnPropertyDescriptor(t.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(t.RTCPeerConnection.prototype,"localDescription",{get(){let u=l.get.apply(this);return u.type===""?u:s(this,u)}}),t.RTCPeerConnection.prototype.removeTrack=function(d){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!d._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(d._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let m;Object.keys(this._streams).forEach(y=>{this._streams[y].getTracks().find(D=>d.track===D)&&(m=this._streams[y])}),m&&(m.getTracks().length===1?this.removeStream(this._reverseStreams[m.id]):m.removeTrack(d.track),this.dispatchEvent(new Event("negotiationneeded")))}}function de(t,e){!t.RTCPeerConnection&&t.webkitRTCPeerConnection&&(t.RTCPeerConnection=t.webkitRTCPeerConnection),t.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(r){let n=t.RTCPeerConnection.prototype[r],i={[r](){return arguments[0]=new(r==="addIceCandidate"?t.RTCIceCandidate:t.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};t.RTCPeerConnection.prototype[r]=i[r]})}function Qe(t,e){e.version>102||A(t,"negotiationneeded",r=>{let n=r.target;if(!((e.version<72||n.getConfiguration&&n.getConfiguration().sdpSemantics==="plan-b")&&n.signalingState!=="stable"))return r})}var me={};le(me,{shimAddTransceiver:()=>nt,shimCreateAnswer:()=>st,shimCreateOffer:()=>it,shimGetDisplayMedia:()=>lr,shimGetParameters:()=>ot,shimGetStats:()=>Xe,shimGetUserMedia:()=>fe,shimOnTrack:()=>We,shimPeerConnection:()=>he,shimRTCDataChannel:()=>rt,shimReceiverGetStats:()=>et,shimRemoveStream:()=>tt,shimSenderGetStats:()=>Ze});function fe(t,e){let r=t&&t.navigator;if(!r.mediaDevices)return;let n=t&&t.MediaStreamTrack;if(r.getUserMedia=function(i,s,a){V("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),r.mediaDevices.getUserMedia(i).then(s,a)},!(e.version>55&&"autoGainControl"in r.mediaDevices.getSupportedConstraints())){let i=function(a,c,l){c in a&&!(l in a)&&(a[l]=a[c],delete a[c])},s=r.mediaDevices.getUserMedia.bind(r.mediaDevices);if(r.mediaDevices.getUserMedia=function(a){return typeof a=="object"&&typeof a.audio=="object"&&(a=JSON.parse(JSON.stringify(a)),i(a.audio,"autoGainControl","mozAutoGainControl"),i(a.audio,"noiseSuppression","mozNoiseSuppression")),s(a)},n&&n.prototype.getSettings){let a=n.prototype.getSettings;n.prototype.getSettings=function(){let c=a.apply(this,arguments);return i(c,"mozAutoGainControl","autoGainControl"),i(c,"mozNoiseSuppression","noiseSuppression"),c}}if(n&&n.prototype.applyConstraints){let a=n.prototype.applyConstraints;n.prototype.applyConstraints=function(c){return this.kind==="audio"&&typeof c=="object"&&(c=JSON.parse(JSON.stringify(c)),i(c,"autoGainControl","mozAutoGainControl"),i(c,"noiseSuppression","mozNoiseSuppression")),a.apply(this,[c])}}}}function lr(t,e){t.navigator.mediaDevices&&(t.navigator.mediaDevices&&"getDisplayMedia"in t.navigator.mediaDevices||(t.navigator.mediaDevices.getDisplayMedia=function(n){if(!(n&&n.video)){let i=new DOMException("getDisplayMedia without video constraints is undefined");return i.name="NotFoundError",i.code=8,Promise.reject(i)}return n.video===!0?n.video={mediaSource:e}:n.video.mediaSource=e,t.navigator.mediaDevices.getUserMedia(n)}))}function We(t){typeof t=="object"&&t.RTCTrackEvent&&"receiver"in t.RTCTrackEvent.prototype&&!("transceiver"in t.RTCTrackEvent.prototype)&&Object.defineProperty(t.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function he(t,e){typeof t!="object"||!(t.RTCPeerConnection||t.mozRTCPeerConnection)||(!t.RTCPeerConnection&&t.mozRTCPeerConnection&&(t.RTCPeerConnection=t.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(r){let n=t.RTCPeerConnection.prototype[r],i={[r](){return arguments[0]=new(r==="addIceCandidate"?t.RTCIceCandidate:t.RTCSessionDescription)(arguments[0]),n.apply(this,arguments)}};t.RTCPeerConnection.prototype[r]=i[r]}))}function Xe(t,e){if(typeof t!="object"||!(t.RTCPeerConnection||t.mozRTCPeerConnection)||e.version>=151)return;let r={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},n=t.RTCPeerConnection.prototype.getStats;t.RTCPeerConnection.prototype.getStats=function(){let[s,a,c]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):n.apply(this,[s||null]).then(l=>{if(e.version<53&&!a)try{l.forEach(u=>{u.type=r[u.type]||u.type})}catch(u){if(u.name!=="TypeError")throw u;l.forEach((d,p)=>{l.set(p,Object.assign({},d,{type:r[d.type]||d.type}))})}return l}).then(a,c)}}function Ze(t){if(!(typeof t=="object"&&t.RTCPeerConnection&&t.RTCRtpSender)||t.RTCRtpSender&&"getStats"in t.RTCRtpSender.prototype)return;let e=t.RTCPeerConnection.prototype.getSenders;e&&(t.RTCPeerConnection.prototype.getSenders=function(){let i=e.apply(this,[]);return i.forEach(s=>s._pc=this),i});let r=t.RTCPeerConnection.prototype.addTrack;r&&(t.RTCPeerConnection.prototype.addTrack=function(){let i=r.apply(this,arguments);return i._pc=this,i}),t.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function et(t){if(!(typeof t=="object"&&t.RTCPeerConnection&&t.RTCRtpSender)||t.RTCRtpSender&&"getStats"in t.RTCRtpReceiver.prototype)return;let e=t.RTCPeerConnection.prototype.getReceivers;e&&(t.RTCPeerConnection.prototype.getReceivers=function(){let n=e.apply(this,[]);return n.forEach(i=>i._pc=this),n}),A(t,"track",r=>(r.receiver._pc=r.srcElement,r)),t.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function tt(t){!t.RTCPeerConnection||"removeStream"in t.RTCPeerConnection.prototype||(t.RTCPeerConnection.prototype.removeStream=function(r){V("removeStream","removeTrack"),this.getSenders().forEach(n=>{n.track&&r.getTracks().includes(n.track)&&this.removeTrack(n)})})}function rt(t){t.DataChannel&&!t.RTCDataChannel&&(t.RTCDataChannel=t.DataChannel)}function nt(t,e){if(!(typeof t=="object"&&t.RTCPeerConnection)||e.version>=110)return;let r=t.RTCPeerConnection.prototype.addTransceiver;r&&(t.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let i=arguments[1]&&arguments[1].sendEncodings;i===void 0&&(i=[]),i=[...i];let s=i.length>0;s&&i.forEach(c=>{if("rid"in c&&!/^[a-z0-9]{0,16}$/i.test(c.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in c&&!(parseFloat(c.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in c&&!(parseFloat(c.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});let a=r.apply(this,arguments);if(s){let{sender:c}=a,l=c.getParameters();(!("encodings"in l)||l.encodings.length===1&&Object.keys(l.encodings[0]).length===0)&&(l.encodings=i,c.sendEncodings=i,this.setParametersPromises.push(c.setParameters(l).then(()=>{delete c.sendEncodings}).catch(()=>{delete c.sendEncodings})))}return a})}function ot(t,e){if(!(typeof t=="object"&&t.RTCRtpSender)||e.version>=110)return;let r=t.RTCRtpSender.prototype.getParameters;r&&(t.RTCRtpSender.prototype.getParameters=function(){let i=r.apply(this,arguments);return"encodings"in i||(i.encodings=[].concat(this.sendEncodings||[{}])),i})}function it(t,e){if(!(typeof t=="object"&&t.RTCPeerConnection)||e.version>=110)return;let r=t.RTCPeerConnection.prototype.createOffer;t.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>r.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):r.apply(this,arguments)}}function st(t,e){if(!(typeof t=="object"&&t.RTCPeerConnection)||e.version>=110)return;let r=t.RTCPeerConnection.prototype.createAnswer;t.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>r.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):r.apply(this,arguments)}}var ge={};le(ge,{shimAudioContext:()=>ht,shimCallbacksAPI:()=>lt,shimConstraints:()=>ur,shimCreateOfferLegacy:()=>ft,shimGetUserMedia:()=>ut,shimLocalStreamsAPI:()=>at,shimRTCIceServerUrls:()=>dt,shimRemoteStreamsAPI:()=>ct,shimTrackEventTransceiver:()=>pt});function at(t){if(!(typeof t!="object"||!t.RTCPeerConnection)){if("getLocalStreams"in t.RTCPeerConnection.prototype||(t.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in t.RTCPeerConnection.prototype)){let e=t.RTCPeerConnection.prototype.addTrack;t.RTCPeerConnection.prototype.addStream=function(n){this._localStreams||(this._localStreams=[]),this._localStreams.includes(n)||this._localStreams.push(n),n.getAudioTracks().forEach(i=>e.call(this,i,n)),n.getVideoTracks().forEach(i=>e.call(this,i,n))},t.RTCPeerConnection.prototype.addTrack=function(n,...i){return i&&i.forEach(s=>{this._localStreams?this._localStreams.includes(s)||this._localStreams.push(s):this._localStreams=[s]}),e.apply(this,arguments)}}"removeStream"in t.RTCPeerConnection.prototype||(t.RTCPeerConnection.prototype.removeStream=function(r){this._localStreams||(this._localStreams=[]);let n=this._localStreams.indexOf(r);if(n===-1)return;this._localStreams.splice(n,1);let i=r.getTracks();this.getSenders().forEach(s=>{i.includes(s.track)&&this.removeTrack(s)})})}}function ct(t){if(!(typeof t!="object"||!t.RTCPeerConnection)&&("getRemoteStreams"in t.RTCPeerConnection.prototype||(t.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in t.RTCPeerConnection.prototype))){Object.defineProperty(t.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(r){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=r),this.addEventListener("track",this._onaddstreampoly=n=>{n.streams.forEach(i=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(i))return;this._remoteStreams.push(i);let s=new Event("addstream");s.stream=i,this.dispatchEvent(s)})})}});let e=t.RTCPeerConnection.prototype.setRemoteDescription;t.RTCPeerConnection.prototype.setRemoteDescription=function(){let n=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(i){i.streams.forEach(s=>{if(n._remoteStreams||(n._remoteStreams=[]),n._remoteStreams.indexOf(s)>=0)return;n._remoteStreams.push(s);let a=new Event("addstream");a.stream=s,n.dispatchEvent(a)})}),e.apply(n,arguments)}}}function lt(t){if(typeof t!="object"||!t.RTCPeerConnection)return;let e=t.RTCPeerConnection.prototype,r=e.createOffer,n=e.createAnswer,i=e.setLocalDescription,s=e.setRemoteDescription,a=e.addIceCandidate;e.createOffer=function(u,d){let p=arguments.length>=2?arguments[2]:arguments[0],m=r.apply(this,[p]);return d?(m.then(u,d),Promise.resolve()):m},e.createAnswer=function(u,d){let p=arguments.length>=2?arguments[2]:arguments[0],m=n.apply(this,[p]);return d?(m.then(u,d),Promise.resolve()):m};let c=function(l,u,d){let p=i.apply(this,[l]);return d?(p.then(u,d),Promise.resolve()):p};e.setLocalDescription=c,c=function(l,u,d){let p=s.apply(this,[l]);return d?(p.then(u,d),Promise.resolve()):p},e.setRemoteDescription=c,c=function(l,u,d){let p=a.apply(this,[l]);return d?(p.then(u,d),Promise.resolve()):p},e.addIceCandidate=c}function ut(t){let e=t&&t.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){let r=e.mediaDevices,n=r.getUserMedia.bind(r);e.mediaDevices.getUserMedia=i=>n(ur(i))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(n,i,s){e.mediaDevices.getUserMedia(n).then(i,s)}.bind(e))}function ur(t){return t&&t.video!==void 0?Object.assign({},t,{video:Je(t.video)}):t}function dt(t){if(!t.RTCPeerConnection)return;let e=t.RTCPeerConnection;t.RTCPeerConnection=function(n,i){if(n&&n.iceServers){let s=[];for(let a=0;a<n.iceServers.length;a++){let c=n.iceServers[a];c.urls===void 0&&c.url?(V("RTCIceServer.url","RTCIceServer.urls"),c=JSON.parse(JSON.stringify(c)),c.urls=c.url,delete c.url,s.push(c)):s.push(n.iceServers[a])}n.iceServers=s}return new e(n,i)},t.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(t.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function pt(t){typeof t=="object"&&t.RTCTrackEvent&&"receiver"in t.RTCTrackEvent.prototype&&!("transceiver"in t.RTCTrackEvent.prototype)&&Object.defineProperty(t.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function ft(t){let e=t.RTCPeerConnection.prototype.createOffer;t.RTCPeerConnection.prototype.createOffer=function(n){if(n){typeof n.offerToReceiveAudio<"u"&&(n.offerToReceiveAudio=!!n.offerToReceiveAudio);let i=this.getTransceivers().find(a=>a.receiver.track.kind==="audio");n.offerToReceiveAudio===!1&&i?i.direction==="sendrecv"?i.setDirection?i.setDirection("sendonly"):i.direction="sendonly":i.direction==="recvonly"&&(i.setDirection?i.setDirection("inactive"):i.direction="inactive"):n.offerToReceiveAudio===!0&&!i&&this.addTransceiver("audio",{direction:"recvonly"}),typeof n.offerToReceiveVideo<"u"&&(n.offerToReceiveVideo=!!n.offerToReceiveVideo);let s=this.getTransceivers().find(a=>a.receiver.track.kind==="video");n.offerToReceiveVideo===!1&&s?s.direction==="sendrecv"?s.setDirection?s.setDirection("sendonly"):s.direction="sendonly":s.direction==="recvonly"&&(s.setDirection?s.setDirection("inactive"):s.direction="inactive"):n.offerToReceiveVideo===!0&&!s&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function ht(t){typeof t!="object"||t.AudioContext||(t.AudioContext=t.webkitAudioContext)}var bt={};le(bt,{removeExtmapAllowMixed:()=>ve,shimAddIceCandidateNullOrEmpty:()=>te,shimConnectionState:()=>ye,shimMaxMessageSize:()=>Z,shimParameterlessSetLocalDescription:()=>re,shimRTCIceCandidate:()=>X,shimRTCIceCandidateRelayProtocol:()=>be,shimSendThrowTypeError:()=>ee});var q=er(gt());function X(t){if(!t.RTCIceCandidate||t.RTCIceCandidate&&"foundation"in t.RTCIceCandidate.prototype)return;let e=t.RTCIceCandidate;t.RTCIceCandidate=function(n){if(typeof n=="object"&&n.candidate&&n.candidate.indexOf("a=")===0&&(n=JSON.parse(JSON.stringify(n)),n.candidate=n.candidate.substring(2)),n.candidate&&n.candidate.length){let i=new e(n),s=q.default.parseCandidate(n.candidate);for(let a in s)a in i||Object.defineProperty(i,a,{value:s[a]});return i.toJSON=function(){return{candidate:i.candidate,sdpMid:i.sdpMid,sdpMLineIndex:i.sdpMLineIndex,usernameFragment:i.usernameFragment}},i}return new e(n)},t.RTCIceCandidate.prototype=e.prototype,A(t,"icecandidate",r=>(r.candidate&&Object.defineProperty(r,"candidate",{value:new t.RTCIceCandidate(r.candidate),writable:"false"}),r))}function be(t){!t.RTCIceCandidate||t.RTCIceCandidate&&"relayProtocol"in t.RTCIceCandidate.prototype||A(t,"icecandidate",e=>{if(e.candidate){let r=q.default.parseCandidate(e.candidate.candidate);r.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[r.priority>>24])}return e})}function Z(t,e){if(!t.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in t.RTCPeerConnection.prototype||Object.defineProperty(t.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp}});let r=function(c){if(!c||!c.sdp)return!1;let l=q.default.splitSections(c.sdp);return l.shift(),l.some(u=>{let d=q.default.parseMLine(u);return d&&d.kind==="application"&&d.protocol.indexOf("SCTP")!==-1})},n=function(c){let l=c.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(l===null||l.length<2)return-1;let u=parseInt(l[1],10);return u!==u?-1:u},i=function(c){let l=65536;return e.browser==="firefox"&&(e.version<57?c===-1?l=16384:l=2147483637:e.version<60?l=e.version===57?65535:65536:l=2147483637),l},s=function(c,l){let u=65536;e.browser==="firefox"&&e.version===57&&(u=65535);let d=q.default.matchPrefix(c.sdp,"a=max-message-size:");return d.length>0?u=parseInt(d[0].substring(19),10):e.browser==="firefox"&&l!==-1&&(u=2147483637),u},a=t.RTCPeerConnection.prototype.setRemoteDescription;t.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){let{sdpSemantics:l}=this.getConfiguration();l==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp},enumerable:!0,configurable:!0})}if(r(arguments[0])){let l=n(arguments[0]),u=i(l),d=s(arguments[0],l),p;u===0&&d===0?p=Number.POSITIVE_INFINITY:u===0||d===0?p=Math.max(u,d):p=Math.min(u,d);let m={};Object.defineProperty(m,"maxMessageSize",{get(){return p}}),this._sctp=m}return a.apply(this,arguments)}}function ee(t,e){if(!(t.RTCPeerConnection&&"createDataChannel"in t.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function r(i,s){let a=i.send;i.send=function(){let l=arguments[0],u=l.length||l.size||l.byteLength;if(i.readyState==="open"&&s.sctp&&u>s.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+s.sctp.maxMessageSize+" bytes)");return a.apply(i,arguments)}}let n=t.RTCPeerConnection.prototype.createDataChannel;t.RTCPeerConnection.prototype.createDataChannel=function(){let s=n.apply(this,arguments);return r(s,this),s},A(t,"datachannel",i=>(r(i.channel,i.target),i))}function ye(t){if(!t.RTCPeerConnection||"connectionState"in t.RTCPeerConnection.prototype)return;let e=t.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(r){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),r&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=r)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(r=>{let n=e[r];e[r]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=i=>{let s=i.target;if(s._lastConnectionState!==s.connectionState){s._lastConnectionState=s.connectionState;let a=new Event("connectionstatechange",i);s.dispatchEvent(a)}return i},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),n.apply(this,arguments)}})}function ve(t,e){if(!t.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;let r=t.RTCPeerConnection.prototype.setRemoteDescription;t.RTCPeerConnection.prototype.setRemoteDescription=function(i){if(i&&i.sdp&&i.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){let s=i.sdp.split(`
`).filter(a=>a.trim()!=="a=extmap-allow-mixed").join(`
`);t.RTCSessionDescription&&i instanceof t.RTCSessionDescription?arguments[0]=new t.RTCSessionDescription({type:i.type,sdp:s}):i.sdp=s}return r.apply(this,arguments)}}function te(t,e){if(!(t.RTCPeerConnection&&t.RTCPeerConnection.prototype))return;let r=t.RTCPeerConnection.prototype.addIceCandidate;!r||r.length===0||(t.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():r.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function re(t,e){if(!(t.RTCPeerConnection&&t.RTCPeerConnection.prototype))return;let r=t.RTCPeerConnection.prototype.setLocalDescription;!r||r.length===0||(t.RTCPeerConnection.prototype.setLocalDescription=function(){let i=arguments[0]||{};if(typeof i!="object"||i.type&&i.sdp)return r.apply(this,arguments);if(i={type:i.type,sdp:i.sdp},!i.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":i.type="offer";break;default:i.type="answer";break}return i.sdp||i.type!=="offer"&&i.type!=="answer"?r.apply(this,[i]):(i.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(a=>r.apply(this,[a]))})}var rn=er(gt());function dr({window:t}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){let r=W,n=sr(t),i={browserDetails:n,commonShim:bt,extractVersion:K,disableLog:or,disableWarnings:ir,sdp:rn};switch(n.browser){case"chrome":if(!pe||!de||!e.shimChrome)return r("Chrome shim is not included in this adapter release."),i;if(n.version===null)return r("Chrome shim can not determine version, not shimming."),i;r("adapter.js shimming chrome."),i.browserShim=pe,te(t,n),re(t,n),ue(t,n),He(t,n),de(t,n),Ke(t,n),Ye(t,n),Ve(t,n),qe(t,n),Qe(t,n),X(t,n),be(t,n),ye(t,n),Z(t,n),ee(t,n),ve(t,n);break;case"firefox":if(!me||!he||!e.shimFirefox)return r("Firefox shim is not included in this adapter release."),i;r("adapter.js shimming firefox."),i.browserShim=me,te(t,n),re(t,n),fe(t,n),he(t,n),Xe(t,n),We(t,n),tt(t,n),Ze(t,n),et(t,n),rt(t,n),nt(t,n),ot(t,n),it(t,n),st(t,n),X(t,n),ye(t,n),Z(t,n),ee(t,n);break;case"safari":if(!ge||!e.shimSafari)return r("Safari shim is not included in this adapter release."),i;r("adapter.js shimming safari."),i.browserShim=ge,te(t,n),re(t,n),dt(t,n),ft(t,n),lt(t,n),at(t,n),ct(t,n),pt(t,n),ut(t,n),ht(t,n),X(t,n),be(t,n),Z(t,n),ee(t,n),ve(t,n);break;default:r("Unsupported browser!");break}return i}var nn=dr({window:typeof window>"u"?void 0:window}),yt=nn;function N(t,e,r,n){Object.defineProperty(t,e,{get:r,set:n,enumerable:!0,configurable:!0})}var xe=class{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{let r=[],n=e.byteLength,i=Math.ceil(n/this.chunkedMTU),s=0,a=0;for(;a<n;){let c=Math.min(n,a+this.chunkedMTU),l=e.slice(a,c),u={__peerData:this._dataCount,n:s,data:l,total:i};r.push(u),a=c,s++}return this._dataCount++,r}}};function on(t){let e=0;for(let i of t)e+=i.byteLength;let r=new Uint8Array(e),n=0;for(let i of t)r.set(i,n),n+=i.byteLength;return r}var vt=yt.default||yt,ne=new class{isWebRTCSupported(){return typeof RTCPeerConnection<"u"}isBrowserSupported(){let t=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(t)?t==="chrome"?e>=this.minChromeVersion:t==="firefox"?e>=this.minFirefoxVersion:t==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return vt.browserDetails.browser}getVersion(){return vt.browserDetails.version||0}isUnifiedPlanSupported(){let t=this.getBrowser(),e=vt.browserDetails.version||0;if(t==="chrome"&&e<this.minChromeVersion)return!1;if(t==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let r,n=!1;try{r=new RTCPeerConnection,r.addTransceiver("audio"),n=!0}catch{}finally{r&&r.close()}return n}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<"u"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},sn=t=>!t||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(t),fr=()=>Math.random().toString(36).slice(2),pr={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"},kt=class extends xe{noop(){}blobToArrayBuffer(e,r){let n=new FileReader;return n.onload=function(i){i.target&&r(i.target.result)},n.readAsArrayBuffer(e),n}binaryStringToArrayBuffer(e){let r=new Uint8Array(e.length);for(let n=0;n<e.length;n++)r[n]=e.charCodeAt(n)&255;return r.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=pr,this.browser=ne.getBrowser(),this.browserVersion=ne.getVersion(),this.pack=ze,this.unpack=Ne,this.supports=function(){let r={browser:ne.isBrowserSupported(),webRTC:ne.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!r.webRTC)return r;let n;try{n=new RTCPeerConnection(pr),r.audioVideo=!0;let i;try{i=n.createDataChannel("_PEERJSTEST",{ordered:!0}),r.data=!0,r.reliable=!!i.ordered;try{i.binaryType="blob",r.binaryBlob=!ne.isIOS}catch{}}catch{}finally{i&&i.close()}}catch{}finally{n&&n.close()}return r}(),this.validateId=sn,this.randomToken=fr}},w=new kt,an="PeerJS: ";var xt=class{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...r){let n=[an,...r];for(let i in n)n[i]instanceof Error&&(n[i]="("+n[i].name+") "+n[i].message);e>=3?console.log(...n):e>=2?console.warn("WARNING",...n):e>=1&&console.error("ERROR",...n)}constructor(){this._logLevel=0}},h=new xt,Dt={},cn=Object.prototype.hasOwnProperty,I="~";function ie(){}Object.create&&(ie.prototype=Object.create(null),new ie().__proto__||(I=!1));function ln(t,e,r){this.fn=t,this.context=e,this.once=r||!1}function hr(t,e,r,n,i){if(typeof r!="function")throw new TypeError("The listener must be a function");var s=new ln(r,n||t,i),a=I?I+e:e;return t._events[a]?t._events[a].fn?t._events[a]=[t._events[a],s]:t._events[a].push(s):(t._events[a]=s,t._eventsCount++),t}function ke(t,e){--t._eventsCount===0?t._events=new ie:delete t._events[e]}function E(){this._events=new ie,this._eventsCount=0}E.prototype.eventNames=function(){var e=[],r,n;if(this._eventsCount===0)return e;for(n in r=this._events)cn.call(r,n)&&e.push(I?n.slice(1):n);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(r)):e};E.prototype.listeners=function(e){var r=I?I+e:e,n=this._events[r];if(!n)return[];if(n.fn)return[n.fn];for(var i=0,s=n.length,a=new Array(s);i<s;i++)a[i]=n[i].fn;return a};E.prototype.listenerCount=function(e){var r=I?I+e:e,n=this._events[r];return n?n.fn?1:n.length:0};E.prototype.emit=function(e,r,n,i,s,a){var c=I?I+e:e;if(!this._events[c])return!1;var l=this._events[c],u=arguments.length,d,p;if(l.fn){switch(l.once&&this.removeListener(e,l.fn,void 0,!0),u){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,r),!0;case 3:return l.fn.call(l.context,r,n),!0;case 4:return l.fn.call(l.context,r,n,i),!0;case 5:return l.fn.call(l.context,r,n,i,s),!0;case 6:return l.fn.call(l.context,r,n,i,s,a),!0}for(p=1,d=new Array(u-1);p<u;p++)d[p-1]=arguments[p];l.fn.apply(l.context,d)}else{var m=l.length,y;for(p=0;p<m;p++)switch(l[p].once&&this.removeListener(e,l[p].fn,void 0,!0),u){case 1:l[p].fn.call(l[p].context);break;case 2:l[p].fn.call(l[p].context,r);break;case 3:l[p].fn.call(l[p].context,r,n);break;case 4:l[p].fn.call(l[p].context,r,n,i);break;default:if(!d)for(y=1,d=new Array(u-1);y<u;y++)d[y-1]=arguments[y];l[p].fn.apply(l[p].context,d)}}return!0};E.prototype.on=function(e,r,n){return hr(this,e,r,n,!1)};E.prototype.once=function(e,r,n){return hr(this,e,r,n,!0)};E.prototype.removeListener=function(e,r,n,i){var s=I?I+e:e;if(!this._events[s])return this;if(!r)return ke(this,s),this;var a=this._events[s];if(a.fn)a.fn===r&&(!i||a.once)&&(!n||a.context===n)&&ke(this,s);else{for(var c=0,l=[],u=a.length;c<u;c++)(a[c].fn!==r||i&&!a[c].once||n&&a[c].context!==n)&&l.push(a[c]);l.length?this._events[s]=l.length===1?l[0]:l:ke(this,s)}return this};E.prototype.removeAllListeners=function(e){var r;return e?(r=I?I+e:e,this._events[r]&&ke(this,r)):(this._events=new ie,this._eventsCount=0),this};E.prototype.off=E.prototype.removeListener;E.prototype.addListener=E.prototype.on;E.prefixed=I;E.EventEmitter=E;Dt=E;var z={};N(z,"ConnectionType",()=>j);N(z,"PeerErrorType",()=>S);N(z,"BaseConnectionErrorType",()=>Ct);N(z,"DataConnectionErrorType",()=>It);N(z,"SerializationType",()=>Pe);N(z,"SocketEventType",()=>L);N(z,"ServerMessageType",()=>P);var j=function(t){return t.Data="data",t.Media="media",t}({}),S=function(t){return t.BrowserIncompatible="browser-incompatible",t.Disconnected="disconnected",t.InvalidID="invalid-id",t.InvalidKey="invalid-key",t.Network="network",t.PeerUnavailable="peer-unavailable",t.SslUnavailable="ssl-unavailable",t.ServerError="server-error",t.SocketError="socket-error",t.SocketClosed="socket-closed",t.UnavailableID="unavailable-id",t.WebRTC="webrtc",t}({}),Ct=function(t){return t.NegotiationFailed="negotiation-failed",t.ConnectionClosed="connection-closed",t}({}),It=function(t){return t.NotOpenYet="not-open-yet",t.MessageToBig="message-too-big",t}({}),Pe=function(t){return t.Binary="binary",t.BinaryUTF8="binary-utf8",t.JSON="json",t.None="raw",t}({}),L=function(t){return t.Message="message",t.Disconnected="disconnected",t.Error="error",t.Close="close",t}({}),P=function(t){return t.Heartbeat="HEARTBEAT",t.Candidate="CANDIDATE",t.Offer="OFFER",t.Answer="ANSWER",t.Open="OPEN",t.Error="ERROR",t.IdTaken="ID-TAKEN",t.InvalidKey="INVALID-KEY",t.Leave="LEAVE",t.Expire="EXPIRE",t}({}),mr="1.5.5",_t=class extends Dt.EventEmitter{constructor(e,r,n,i,s,a=5e3){super(),this.pingInterval=a,this._disconnected=!0,this._messagesQueue=[];let c=e?"wss://":"ws://";this._baseUrl=c+r+":"+n+i+"peerjs?key="+s}start(e,r){this._id=e;let n=`${this._baseUrl}&id=${e}&token=${r}`;this._socket||!this._disconnected||(this._socket=new WebSocket(n+"&version="+mr),this._disconnected=!1,this._socket.onmessage=i=>{let s;try{s=JSON.parse(i.data),h.log("Server message received:",s)}catch{h.log("Invalid server message",i.data);return}this.emit(L.Message,s)},this._socket.onclose=i=>{this._disconnected||(h.log("Socket closed.",i),this._cleanup(),this._disconnected=!0,this.emit(L.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),h.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){h.log("Cannot send heartbeat, because socket closed");return}let e=JSON.stringify({type:P.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){let e=[...this._messagesQueue];this._messagesQueue=[];for(let r of e)this.send(r)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(L.Error,"Invalid message");return}if(!this._wsOpen())return;let r=JSON.stringify(e);this._socket.send(r)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}},Ce=class{constructor(e){this.connection=e}startConnection(e){let r=this._startPeerConnection();if(this.connection.peerConnection=r,this.connection.type===j.Media&&e._stream&&this._addTracksToConnection(e._stream,r),e.originator){let n=this.connection,i={ordered:!!e.reliable},s=r.createDataChannel(n.label,i);n._initializeDataChannel(s),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){h.log("Creating RTCPeerConnection.");let e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){let r=this.connection.peer,n=this.connection.connectionId,i=this.connection.type,s=this.connection.provider;h.log("Listening for ICE candidates."),e.onicecandidate=a=>{!a.candidate||!a.candidate.candidate||(h.log(`Received ICE candidates for ${r}:`,a.candidate),s.socket.send({type:P.Candidate,payload:{candidate:a.candidate,type:i,connectionId:n},dst:r}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":h.log("iceConnectionState is failed, closing connections to "+r),this.connection.emitError(Ct.NegotiationFailed,"Negotiation of connection to "+r+" failed."),this.connection.close();break;case"closed":h.log("iceConnectionState is closed, closing connections to "+r),this.connection.emitError(Ct.ConnectionClosed,"Connection to "+r+" closed."),this.connection.close();break;case"disconnected":h.log("iceConnectionState changed to disconnected on the connection with "+r);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},h.log("Listening for data channel"),e.ondatachannel=a=>{h.log("Received data channel");let c=a.channel;s.getConnection(r,n)._initializeDataChannel(c)},h.log("Listening for remote stream"),e.ontrack=a=>{h.log("Received remote stream");let c=a.streams[0],l=s.getConnection(r,n);if(l.type===j.Media){let u=l;this._addStreamToMediaConnection(c,u)}}}cleanup(){h.log("Cleaning up PeerConnection to "+this.connection.peer);let e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};let r=e.signalingState!=="closed",n=!1,i=this.connection.dataChannel;i&&(n=!!i.readyState&&i.readyState!=="closed"),(r||n)&&e.close()}async _makeOffer(){let e=this.connection.peerConnection,r=this.connection.provider;try{let n=await e.createOffer(this.connection.options.constraints);h.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),h.log("Set localDescription:",n,`for:${this.connection.peer}`);let i={sdp:n,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===j.Data){let s=this.connection;i={...i,label:s.label,reliable:s.reliable,serialization:s.serialization}}r.socket.send({type:P.Offer,payload:i,dst:this.connection.peer})}catch(i){i!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(r.emitError(S.WebRTC,i),h.log("Failed to setLocalDescription, ",i))}}catch(n){r.emitError(S.WebRTC,n),h.log("Failed to createOffer, ",n)}}async _makeAnswer(){let e=this.connection.peerConnection,r=this.connection.provider;try{let n=await e.createAnswer();h.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(n.sdp=this.connection.options.sdpTransform(n.sdp)||n.sdp);try{await e.setLocalDescription(n),h.log("Set localDescription:",n,`for:${this.connection.peer}`),r.socket.send({type:P.Answer,payload:{sdp:n,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(i){r.emitError(S.WebRTC,i),h.log("Failed to setLocalDescription, ",i)}}catch(n){r.emitError(S.WebRTC,n),h.log("Failed to create answer, ",n)}}async handleSDP(e,r){r=new RTCSessionDescription(r);let n=this.connection.peerConnection,i=this.connection.provider;h.log("Setting remote description",r);let s=this;try{await n.setRemoteDescription(r),h.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await s._makeAnswer()}catch(a){i.emitError(S.WebRTC,a),h.log("Failed to setRemoteDescription, ",a)}}async handleCandidate(e){h.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),h.log(`Added ICE candidate for:${this.connection.peer}`)}catch(r){this.connection.provider.emitError(S.WebRTC,r),h.log("Failed to handleCandidate, ",r)}}_addTracksToConnection(e,r){if(h.log(`add tracks from stream ${e.id} to peer connection`),!r.addTrack)return h.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(n=>{r.addTrack(n,e)})}_addStreamToMediaConnection(e,r){h.log(`add stream ${e.id} to media connection ${r.connectionId}`),r.addStream(e)}},_e=class extends Dt.EventEmitter{emitError(e,r){h.error("Error:",r),this.emit("error",new St(`${e}`,r))}},St=class extends Error{constructor(e,r){typeof r=="string"?super(r):(super(),Object.assign(this,r)),this.type=e}},Se=class extends _e{get open(){return this._open}constructor(e,r,n){super(),this.peer=e,this.provider=r,this.options=n,this._open=!1,this.metadata=n.metadata}},Te=class t extends Se{static#e=this.ID_PREFIX="mc_";get type(){return j.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,r,n){super(e,r,n),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||t.ID_PREFIX+w.randomToken(),this._negotiator=new Ce(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{h.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{h.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){h.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){let r=e.type,n=e.payload;switch(e.type){case P.Answer:this._negotiator.handleSDP(r,n.sdp),this._open=!0;break;case P.Candidate:this._negotiator.handleCandidate(n.candidate);break;default:h.warn(`Unrecognized message type:${r} from peer:${this.peer}`);break}}answer(e,r={}){if(this._localStream){h.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,r&&r.sdpTransform&&(this.options.sdpTransform=r.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});let n=this.provider._getMessages(this.connectionId);for(let i of n)this.handleMessage(i);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}},Tt=class{constructor(e){this._options=e}_buildRequest(e){let r=this._options.secure?"https":"http",{host:n,port:i,path:s,key:a}=this._options,c=new URL(`${r}://${n}:${i}${s}${a}/${e}`);return c.searchParams.set("ts",`${Date.now()}${Math.random()}`),c.searchParams.set("version",mr),fetch(c.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{let e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){h.error("Error retrieving ID",e);let r="";throw this._options.path==="/"&&this._options.host!==w.CLOUD_HOST&&(r=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+r)}}async listAllPeers(){try{let e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let r="";throw this._options.host===w.CLOUD_HOST?r="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":r="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+r)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw h.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}},Re=class t extends Se{static#e=this.ID_PREFIX="dc_";static#t=this.MAX_BUFFERED_AMOUNT=8388608;get type(){return j.Data}constructor(e,r,n){super(e,r,n),this.connectionId=this.options.connectionId||t.ID_PREFIX+fr(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new Ce(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{h.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=r=>{h.log(`DC#${this.connectionId} dc onmessage:`,r.data)},this.dataChannel.onclose=()=>{h.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,r=!1){if(!this.open){this.emitError(It.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,r)}async handleMessage(e){let r=e.payload;switch(e.type){case P.Answer:await this._negotiator.handleSDP(e.type,r.sdp);break;case P.Candidate:await this._negotiator.handleCandidate(r.candidate);break;default:h.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}},se=class extends Re{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",r=>this._handleDataMessage(r))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>Re.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(r){return h.error(`DC#:${this.connectionId} Error when sending:`,r),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;let e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}},oe=class extends se{close(e){super.close(e),this._chunkedData={}}constructor(e,r,n){super(e,r,n),this.chunker=new xe,this.serialization=Pe.Binary,this._chunkedData={}}_handleDataMessage({data:e}){let r=Ne(e),n=r.__peerData;if(n){if(n.type==="close"){this.close();return}this._handleChunk(r);return}this.emit("data",r)}_handleChunk(e){let r=e.__peerData,n=this._chunkedData[r]||{data:[],count:0,total:e.total};if(n.data[e.n]=new Uint8Array(e.data),n.count++,this._chunkedData[r]=n,n.total===n.count){delete this._chunkedData[r];let i=on(n.data);this._handleDataMessage({data:i})}}_send(e,r){let n=ze(e);if(n instanceof Promise)return this._send_blob(n);if(!r&&n.byteLength>this.chunker.chunkedMTU){this._sendChunks(n);return}this._bufferedSend(n)}async _send_blob(e){let r=await e;if(r.byteLength>this.chunker.chunkedMTU){this._sendChunks(r);return}this._bufferedSend(r)}_sendChunks(e){let r=this.chunker.chunk(e);h.log(`DC#${this.connectionId} Try to send ${r.length} chunks...`);for(let n of r)this.send(n,!0)}},Rt=class extends se{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,r){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=Pe.None}},Pt=class extends se{_handleDataMessage({data:e}){let r=this.parse(this.decoder.decode(e)),n=r.__peerData;if(n&&n.type==="close"){this.close();return}this.emit("data",r)}_send(e,r){let n=this.encoder.encode(this.stringify(e));if(n.byteLength>=w.chunkedMTU){this.emitError(It.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(n)}constructor(...e){super(...e),this.serialization=Pe.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}};var Et=class t extends _e{static#e=this.DEFAULT_KEY="peerjs";get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){let e=Object.create(null);for(let[r,n]of this._connections)e[r]=n;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,r){super(),this._serializers={raw:Rt,json:Pt,binary:oe,"binary-utf8":oe,default:oe},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let n;if(e&&e.constructor==Object?r=e:e&&(n=e.toString()),r={debug:0,host:w.CLOUD_HOST,port:w.CLOUD_PORT,path:"/",key:t.DEFAULT_KEY,token:w.randomToken(),config:w.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...r},this._options=r,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==w.CLOUD_HOST?this._options.secure=w.isSecure():this._options.host==w.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&h.setLogFunction(this._options.logFunction),h.logLevel=this._options.debug||0,this._api=new Tt(r),this._socket=this._createServerConnection(),!w.supports.audioVideo&&!w.supports.data){this._delayedAbort(S.BrowserIncompatible,"The current browser does not support WebRTC");return}if(n&&!w.validateId(n)){this._delayedAbort(S.InvalidID,`ID "${n}" is invalid`);return}n?this._initialize(n):this._api.retrieveId().then(i=>this._initialize(i)).catch(i=>this._abort(S.ServerError,i))}_createServerConnection(){let e=new _t(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(L.Message,r=>{this._handleMessage(r)}),e.on(L.Error,r=>{this._abort(S.SocketError,r)}),e.on(L.Disconnected,()=>{this.disconnected||(this.emitError(S.Network,"Lost connection to server."),this.disconnect())}),e.on(L.Close,()=>{this.disconnected||this._abort(S.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){let r=e.type,n=e.payload,i=e.src;switch(r){case P.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case P.Error:this._abort(S.ServerError,n.msg);break;case P.IdTaken:this._abort(S.UnavailableID,`ID "${this.id}" is taken`);break;case P.InvalidKey:this._abort(S.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case P.Leave:h.log(`Received leave message from ${i}`),this._cleanupPeer(i),this._connections.delete(i);break;case P.Expire:this.emitError(S.PeerUnavailable,`Could not connect to peer ${i}`);break;case P.Offer:{let s=n.connectionId,a=this.getConnection(i,s);if(a&&(a.close(),h.warn(`Offer received for existing Connection ID:${s}`)),n.type===j.Media){let l=new Te(i,this,{connectionId:s,_payload:n,metadata:n.metadata});a=l,this._addConnection(i,a),this.emit("call",l)}else if(n.type===j.Data){let l=new this._serializers[n.serialization](i,this,{connectionId:s,_payload:n,metadata:n.metadata,label:n.label,serialization:n.serialization,reliable:n.reliable});a=l,this._addConnection(i,a),this.emit("connection",l)}else{h.warn(`Received malformed connection type:${n.type}`);return}let c=this._getMessages(s);for(let l of c)a.handleMessage(l);break}default:{if(!n){h.warn(`You received a malformed message from ${i} of type ${r}`);return}let s=n.connectionId,a=this.getConnection(i,s);a&&a.peerConnection?a.handleMessage(e):s?this._storeMessage(s,e):h.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,r){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(r)}_getMessages(e){let r=this._lostMessages.get(e);return r?(this._lostMessages.delete(e),r):[]}connect(e,r={}){if(r={serialization:"default",...r},this.disconnected){h.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(S.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}let n=new this._serializers[r.serialization](e,this,r);return this._addConnection(e,n),n}call(e,r,n={}){if(this.disconnected){h.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(S.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!r){h.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}let i=new Te(e,this,{...n,_stream:r});return this._addConnection(e,i),i}_addConnection(e,r){h.log(`add connection ${r.type}:${r.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(r)}_removeConnection(e){let r=this._connections.get(e.peer);if(r){let n=r.indexOf(e);n!==-1&&r.splice(n,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,r){let n=this._connections.get(e);if(!n)return null;for(let i of n)if(i.connectionId===r)return i;return null}_delayedAbort(e,r){setTimeout(()=>{this._abort(e,r)},0)}_abort(e,r){h.error("Aborting!"),this.emitError(e,r),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(h.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(let e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){let r=this._connections.get(e);if(r)for(let n of r)n.close()}disconnect(){if(this.disconnected)return;let e=this.id;h.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)h.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)h.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=r=>{}){this._api.listAllPeers().then(r=>e(r)).catch(r=>this._abort(S.ServerError,r))}};var wt=Et;var gr=`/* ------------------------------------------------------------------
   BONK \u2014 panneau flottant
   Langage visuel align\xE9 sur le th\xE8me Lucid (Fluent / glassmorphism) :
   surfaces translucides, filets \xE0 10 % qui passent \xE0 30 % au survol,
   rayons 8 / 12 / 16 qui s'arrondissent en pilule, flou 28 px satur\xE9.
   Les tokens --clr-*, --border-*, --br, --m-br, --l-br et
   --encore-body-font-stack sont h\xE9rit\xE9s de Lucid quand il est actif ;
   sinon les valeurs de repli gardent le m\xEAme rendu sur Spotify nu.
   ------------------------------------------------------------------ */

#bonk-panel {
  --on-text: var(--clr-on-surface, #f4f2f7);
  --on-muted: var(--clr-on-surface-variant, #a9a2b6);
  --on-faint: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.42);
  --on-accent: #a970ff;
  --on-accent-soft: #c6a8ff;
  --on-accent-ink: #1a0728;
  --on-glass: rgba(var(--clr-surface-1-rgb, 24, 24, 28), 0.58);
  --on-raised: rgba(var(--clr-surface-2-rgb, 36, 36, 42), 0.55);
  --on-border: var(--border-thickness, 1px) var(--border-style, solid)
    var(--border-clr, rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.1));
  --on-border-hover: var(--border-thickness, 1px) var(--border-style, solid)
    var(--border-h-clr, rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.3));
  --on-blur: blur(28px) saturate(1.5);
  --on-blur-sm: blur(14px) saturate(1.4);
  --on-br: var(--br, 8px);
  --on-br-md: var(--m-br, 12px);
  --on-br-lg: var(--l-br, 16px);
  --on-br-xl: var(--xl-br, 32px);
  --on-ease: 200ms cubic-bezier(0.4, 0, 0.2, 1);

  position: fixed;
  right: 14px;
  bottom: 98px;
  width: 360px;
  max-height: min(78vh, 700px);
  z-index: 99999;
  display: none;
  flex-direction: column;
  overflow: hidden;
  border: var(--on-border);
  border-radius: var(--on-br-lg);
  color: var(--on-text);
  background:
    radial-gradient(120% 100% at 0% 0%, rgba(169, 112, 255, 0.13), transparent 62%),
    var(--on-glass);
  -webkit-backdrop-filter: var(--on-blur) brightness(0.94);
  backdrop-filter: var(--on-blur) brightness(0.94);
  box-shadow:
    0 28px 72px -32px rgba(0, 0, 0, 0.78),
    0 1px 3px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  font-family: var(
    --encore-body-font-stack,
    var(--font-family, "Spotify MixUI", "CircularSp", system-ui, -apple-system, "Segoe UI", sans-serif)
  );
  font-size: 13px;
  line-height: 1.45;
  text-align: left;
}

#bonk-panel.bonk-open {
  display: flex;
  animation: bonk-in 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes bonk-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.988);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ---------------------------- header ---------------------------- */

.bonk-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 13px 14px;
  border-bottom: var(--on-border);
  background: rgba(255, 255, 255, 0.02);
}

.bonk-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.bonk-mark {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: none;
  border: var(--on-border);
  border-radius: var(--on-br-md);
  color: var(--on-accent-soft);
  background: rgba(169, 112, 255, 0.16);
  transition: border-radius var(--on-ease), border-color var(--on-ease);
}

.bonk-mark svg {
  width: 16px;
  height: 16px;
}

.bonk-brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.bonk-title {
  font-family: "BONK Display", var(--encore-title-font-stack, "Spotify MixUI Title", system-ui, sans-serif);
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.015em;
  line-height: 1.12;
  text-transform: uppercase;
}

.bonk-subtitle {
  max-width: 210px;
  overflow: hidden;
  font-size: 11px;
  color: var(--on-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bonk-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bonk-status {
  width: 6px;
  height: 6px;
  flex: none;
  border-radius: 50%;
  background: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.22);
}

.bonk-status.live {
  background: var(--on-accent-soft);
  box-shadow: 0 0 8px rgba(169, 112, 255, 0.75);
  animation: bonk-pulse 2.4s ease-out infinite;
}

@keyframes bonk-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(169, 112, 255, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(169, 112, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(169, 112, 255, 0);
  }
}

.bonk-icon-btn {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: var(--on-border);
  border-radius: var(--on-br);
  background: rgba(255, 255, 255, 0.05);
  color: var(--on-muted);
  cursor: pointer;
  transition: border-color var(--on-ease), background var(--on-ease), color var(--on-ease),
    border-radius var(--on-ease);
}

.bonk-icon-btn:hover {
  border: var(--on-border-hover);
  background: rgba(255, 255, 255, 0.09);
  color: var(--on-text);
}

/* ----------------------------- body ----------------------------- */

.bonk-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.bonk-body::-webkit-scrollbar {
  width: 6px;
}

.bonk-body::-webkit-scrollbar-thumb {
  border-radius: 99px;
  background: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.22);
}

.bonk-body::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.4);
}

/* ----------------------------- idle ----------------------------- */

.bonk-hero {
  padding: 10px 8px 2px;
  text-align: center;
}

.bonk-hero-mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  border: var(--on-border);
  border-radius: var(--on-br-lg);
  color: var(--on-accent-soft);
  background: rgba(169, 112, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.bonk-hero-mark svg {
  width: 22px;
  height: 22px;
}

.bonk-hero h2 {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 660;
  letter-spacing: -0.01em;
}

.bonk-hero p {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--on-muted);
}

/* ---------------------------- buttons ---------------------------- */

.bonk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 14px;
  border: var(--on-border);
  border-radius: var(--on-br);
  background: rgba(255, 255, 255, 0.05);
  color: var(--on-text);
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--on-ease), border-color var(--on-ease), border-radius var(--on-ease),
    opacity var(--on-ease);
}

.bonk-btn:hover:not(:disabled) {
  border: var(--on-border-hover);
  border-radius: var(--on-br-xl);
  background: rgba(255, 255, 255, 0.09);
}

.bonk-btn:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.bonk-primary {
  border: 1px solid transparent;
  background: var(--on-accent);
  color: #fff;
  box-shadow: 0 10px 24px -14px rgba(169, 112, 255, 0.9);
}

.bonk-primary:hover:not(:disabled) {
  border-color: transparent;
  background: #b98cff;
  box-shadow: 0 14px 28px -14px rgba(169, 112, 255, 0.95);
}

.bonk-ghost {
  border-color: transparent;
  background: transparent;
  color: var(--on-muted);
}

.bonk-ghost:hover:not(:disabled) {
  border-color: transparent;
  border-radius: var(--on-br-xl);
  background: rgba(255, 255, 255, 0.06);
  color: var(--on-text);
}

.bonk-full {
  width: 100%;
}

.bonk-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--on-faint);
}

.bonk-divider::before,
.bonk-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.1);
}

.bonk-join {
  display: flex;
  gap: 8px;
}

.bonk-input {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: var(--on-border);
  border-radius: var(--on-br);
  background: rgba(255, 255, 255, 0.05);
  color: var(--on-text);
  font: inherit;
  font-size: 13px;
  font-weight: 640;
  letter-spacing: 0.22em;
  text-align: center;
  text-transform: uppercase;
  outline: none;
  transition: border-color var(--on-ease), box-shadow var(--on-ease);
}

.bonk-input::placeholder {
  color: var(--on-faint);
  letter-spacing: 0.22em;
}

.bonk-input:focus {
  border-color: rgba(169, 112, 255, 0.65);
  box-shadow: 0 0 0 3px rgba(169, 112, 255, 0.16);
}

.bonk-error {
  padding: 9px 11px;
  border: 1px solid rgba(243, 114, 127, 0.32);
  border-radius: var(--on-br);
  background: rgba(243, 114, 127, 0.1);
  color: #ffd9df;
  font-size: 11.5px;
  line-height: 1.5;
}

.bonk-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-top: 2px;
  font-size: 10.5px;
  color: var(--on-faint);
}

/* -------------------------- now playing -------------------------- */

.bonk-np {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px;
  border: var(--on-border);
  border-radius: var(--on-br-md);
  background: rgba(255, 255, 255, 0.045);
  -webkit-backdrop-filter: var(--on-blur-sm);
  backdrop-filter: var(--on-blur-sm);
}

.bonk-art {
  position: relative;
  width: 54px;
  height: 54px;
  flex: none;
  overflow: hidden;
  border-radius: var(--on-br);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.07);
}

.bonk-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bonk-art-ph {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 20px;
  color: var(--on-faint);
}

.bonk-eq {
  position: absolute;
  left: 5px;
  bottom: 5px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 11px;
  padding: 2px 4px;
  border-radius: 6px;
  background: rgba(12, 8, 20, 0.72);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.bonk-eq i {
  display: block;
  width: 2.5px;
  height: 35%;
  border-radius: 2px;
  background: var(--on-accent-soft);
  animation: bonk-bounce 0.85s ease-in-out infinite alternate;
}

.bonk-eq i:nth-child(2) {
  animation-delay: 0.14s;
}

.bonk-eq i:nth-child(3) {
  animation-delay: 0.32s;
}

.bonk-eq i:nth-child(4) {
  animation-delay: 0.06s;
}

@keyframes bonk-bounce {
  from {
    height: 25%;
  }
  to {
    height: 100%;
  }
}

.bonk-np-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.bonk-np-label {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--on-faint);
}

.bonk-np-title {
  overflow: hidden;
  font-size: 13.5px;
  font-weight: 640;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bonk-np-artist {
  overflow: hidden;
  font-size: 11.5px;
  color: var(--on-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* --------------------------- progress --------------------------- */

.bonk-progress {
  height: 3px;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.14);
  transition: height var(--on-ease), background var(--on-ease);
}

.bonk-progress-fill {
  width: 0;
  height: 100%;
  border-radius: 99px;
  background: var(--on-accent-soft);
  box-shadow: 0 0 10px -2px rgba(198, 168, 255, 0.8);
  transition: none;
}

.bonk-progress-live {
  height: 5px;
  cursor: pointer;
}

.bonk-progress-live:hover {
  height: 7px;
  background: rgba(169, 112, 255, 0.24);
}

.bonk-times {
  display: flex;
  justify-content: space-between;
  margin-top: -4px;
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
  color: var(--on-faint);
}

/* --------------------------- controls --------------------------- */

.bonk-transport {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 2px 0;
}

.bonk-round {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: var(--on-border);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: var(--on-text);
  cursor: pointer;
  transition: background var(--on-ease), border-color var(--on-ease), transform var(--on-ease);
}

.bonk-round:hover {
  border: var(--on-border-hover);
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.04);
}

.bonk-play {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: var(--on-accent);
  color: #fff;
  box-shadow: 0 12px 26px -12px rgba(169, 112, 255, 0.95);
}

.bonk-play:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: #b98cff;
  transform: scale(1.04);
}

.bonk-host-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 3px 0;
  font-size: 11.5px;
  color: var(--on-muted);
}

.bonk-host-note b {
  color: var(--on-text);
  font-weight: 620;
}

.bonk-host-note .bonk-mini {
  margin-left: 2px;
}

/* ----------------------------- code ----------------------------- */

.bonk-code {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 11px;
  border: 1px dashed rgba(169, 112, 255, 0.4);
  border-radius: var(--on-br-md);
  background: rgba(169, 112, 255, 0.08);
  color: var(--on-text);
  font: inherit;
  cursor: pointer;
  transition: background var(--on-ease), border-color var(--on-ease), border-radius var(--on-ease);
}

.bonk-code:hover {
  border-color: rgba(198, 168, 255, 0.75);
  border-radius: var(--on-br-xl);
  background: rgba(169, 112, 255, 0.14);
}

.bonk-code-label {
  font-size: 9.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--on-faint);
}

.bonk-code-value {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.24em;
}

.bonk-code-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 10.5px;
  color: var(--on-muted);
}

/* --------------------------- listeners --------------------------- */

.bonk-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  font-size: 9.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--on-faint);
}

.bonk-members {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bonk-member {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: var(--on-br-md);
  transition: background var(--on-ease), border-color var(--on-ease);
}

.bonk-member:hover {
  border-color: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.12);
  background: rgba(255, 255, 255, 0.04);
}

.bonk-member-host {
  border-color: rgba(169, 112, 255, 0.32);
  background: rgba(169, 112, 255, 0.13);
}

.bonk-member-host:hover {
  border-color: rgba(169, 112, 255, 0.48);
  background: rgba(169, 112, 255, 0.17);
}

.bonk-avatar {
  width: 25px;
  height: 25px;
  flex: none;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.12);
}

.bonk-initial {
  display: grid;
  place-items: center;
  font-size: 11.5px;
  font-weight: 650;
  color: var(--on-text);
}

.bonk-member-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 12.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bonk-member-name em {
  font-size: 10.5px;
  font-style: normal;
  color: var(--on-faint);
}

.bonk-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border: 1px solid rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.1);
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--on-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.bonk-tag-host {
  border-color: rgba(198, 168, 255, 0.35);
  background: rgba(169, 112, 255, 0.2);
  color: #f1e9ff;
}

.bonk-mini {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border: 1px solid rgba(169, 112, 255, 0.38);
  border-radius: var(--on-br);
  background: rgba(169, 112, 255, 0.14);
  color: #f1e9ff;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--on-ease), border-color var(--on-ease), border-radius var(--on-ease);
}

.bonk-mini:hover {
  border-color: rgba(198, 168, 255, 0.8);
  border-radius: var(--on-br-xl);
  background: rgba(169, 112, 255, 0.24);
}

.bonk-mini-ghost {
  border-color: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--on-muted);
}

.bonk-mini-ghost:hover {
  border-color: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.3);
  background: rgba(255, 255, 255, 0.08);
  color: var(--on-text);
}

.bonk-trigger-on {
  color: var(--on-accent-soft) !important;
}

@media (max-width: 700px) {
  #bonk-panel {
    right: 8px;
    left: 8px;
    bottom: 94px;
    width: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  #bonk-panel,
  .bonk-eq i,
  .bonk-status.live,
  .bonk-trigger-ping {
    animation: none !important;
  }

  #bonk-panel * {
    transition: none !important;
  }
}

/* ------------------------------ duo ------------------------------ */

.bonk-duo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 9px;
  border: var(--on-border);
  border-radius: var(--on-br-md);
  background: rgba(255, 255, 255, 0.045);
  -webkit-backdrop-filter: var(--on-blur-sm);
  backdrop-filter: var(--on-blur-sm);
}

.bonk-duo-icon {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: none;
  border: 1px solid rgba(169, 112, 255, 0.28);
  border-radius: var(--on-br);
  background: rgba(169, 112, 255, 0.16);
  color: var(--on-accent-soft);
}

.bonk-duo-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.bonk-duo-text b {
  overflow: hidden;
  font-size: 12.5px;
  font-weight: 620;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bonk-duo-text small {
  font-size: 10.5px;
  color: var(--on-muted);
}

.bonk-duo-code {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 9px;
  border: var(--on-border);
  border-radius: var(--on-br);
  background: rgba(255, 255, 255, 0.04);
}

.bonk-duo-code b {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--on-text);
}

.bonk-duo-code .bonk-mini {
  margin-left: auto;
}

.bonk-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.bonk-trigger-ping {
  animation: bonk-ring 1.8s ease-out infinite;
}

@keyframes bonk-ring {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

/* ----------------------------- stats ----------------------------- */

.bonk-stats-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: var(--on-border);
  border-radius: var(--on-br-md);
  background: rgba(255, 255, 255, 0.045);
  color: var(--on-text);
  font: inherit;
  cursor: pointer;
  transition: background var(--on-ease), border-color var(--on-ease), border-radius var(--on-ease);
}

.bonk-stats-head:hover {
  border: var(--on-border-hover);
  border-radius: var(--on-br-xl);
  background: rgba(255, 255, 255, 0.08);
}

.bonk-stats-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--on-muted);
  white-space: nowrap;
}

.bonk-stats-summary {
  flex: 1;
  overflow: hidden;
  font-size: 11px;
  color: var(--on-faint);
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: right;
}

.bonk-chevron {
  font-size: 9px;
  color: var(--on-faint);
}

.bonk-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.bonk-stats-grid > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 9px 4px;
  border: var(--on-border);
  border-radius: var(--on-br-md);
  background: rgba(255, 255, 255, 0.04);
}

.bonk-stats-grid b {
  font-size: 14px;
  font-weight: 680;
  letter-spacing: -0.01em;
}

.bonk-stats-grid small {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--on-faint);
}

.bonk-top {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.bonk-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 6px;
  border: 1px solid transparent;
  border-radius: var(--on-br);
  transition: background var(--on-ease), border-color var(--on-ease);
}

.bonk-top-row:hover {
  border-color: rgba(var(--clr-on-surface-rgb, 255, 255, 255), 0.1);
  background: rgba(255, 255, 255, 0.04);
}

.bonk-top-art {
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 6px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.08);
}

.bonk-top-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.bonk-top-info b {
  overflow: hidden;
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bonk-top-info small {
  overflow: hidden;
  font-size: 10px;
  color: var(--on-faint);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bonk-count {
  padding: 1px 7px;
  border: 1px solid rgba(198, 168, 255, 0.3);
  border-radius: 99px;
  background: rgba(169, 112, 255, 0.16);
  font-size: 10px;
  font-weight: 650;
  color: #f1e9ff;
}

.bonk-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.bonk-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border: var(--on-border);
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 10.5px;
  color: var(--on-muted);
}

.bonk-chip b {
  color: var(--on-text);
  font-weight: 650;
}

.bonk-stats-actions {
  display: flex;
  justify-content: flex-end;
}

.bonk-stats-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border: 1px dashed rgba(169, 112, 255, 0.24);
  border-radius: var(--on-br-md);
  background: rgba(255, 255, 255, 0.03);
  font-size: 11px;
  line-height: 1.45;
  color: var(--on-muted);
}

.bonk-mini-danger {
  border-color: rgba(243, 114, 127, 0.5);
  background: rgba(243, 114, 127, 0.16);
  color: #ffd9df;
}

.bonk-mini-danger:hover {
  border-color: rgba(243, 114, 127, 0.8);
  background: rgba(243, 114, 127, 0.24);
}

/* ------------------------- sauvegarde en ligne ------------------------- */

.bonk-cloud {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 9px 10px;
  border: 1px dashed rgba(169, 112, 255, 0.24);
  border-radius: var(--on-br-md);
  background: rgba(255, 255, 255, 0.03);
}

.bonk-cloud-head {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--on-muted);
}

.bonk-cloud-note {
  font-size: 10px;
  line-height: 1.45;
  color: var(--on-faint);
}


.bonk-duo-code-big {
  padding: 14px 12px;
}

.bonk-duo-code-big b {
  font-size: 22px;
  letter-spacing: 0.16em;
}

.bonk-mini-on {
  color: #e9dcff;
  border-color: rgba(169, 112, 255, 0.5);
  background: rgba(169, 112, 255, 0.18);
}

.bonk-duo-live {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--on-br-md);
  background: rgba(169, 112, 255, 0.1);
  border: 1px solid rgba(169, 112, 255, 0.2);
}

.bonk-duo-live-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--on-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`;var br="data:font/woff2;base64,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";var Nt="bonk-aux-",yr="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",pn=400,fn=1500,vr=1200,kr={debug:0,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478"},{urls:"turn:openrelay.metered.ca:80",username:"openrelayproject",credential:"openrelayproject"},{urls:"turn:openrelay.metered.ca:443",username:"openrelayproject",credential:"openrelayproject"},{urls:"turn:openrelay.metered.ca:443?transport=tcp",username:"openrelayproject",credential:"openrelayproject"}],iceCandidatePoolSize:10}},C={jam:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>',play:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',prev:'<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>',next:'<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z"/></svg>',copy:'<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 4h9a2 2 0 0 1 2 2v9h-2V6H8V4z"/><path d="M5 8h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2zm0 2v10h9V10H5z"/></svg>',close:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',note:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',crown:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4.2 4.6L12 5.5l4.8 7.1L21 8l-1.6 9.2H4.6z"/></svg>',cloud:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 9.4A3.8 3.8 0 0 0 7 18z"/></svg>',check:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',refresh:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>',headphones:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 14v-2a8 8 0 0 1 16 0v2" stroke-linecap="round"/><rect x="2.6" y="13" width="4.4" height="7" rx="2.2"/><rect x="17" y="13" width="4.4" height="7" rx="2.2"/></svg>',chart:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>'},xr='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>',o={me:{name:"Auditeur",image:"",username:""},role:null,code:"",peerId:"",authority:"",hostName:"",members:[],conns:new Map,hostConn:null,peer:null,remote:{uri:null,name:"",artist:"",art:"",duration:0,playing:!1,progress:0,at:Date.now()},hasRemote:!1,joined:!1,open:!1,busy:!1,error:"",input:"",sig:"",lastPush:0,copied:null,duo:null,duoInput:"",mode:"manual",following:!1,applyingUntil:0,connectingDuo:!1,pendingPeer:null,duoPaused:!1,autoJoin:!1,lastNotify:{uri:"",at:0},stats:[],statsOpen:!1,lastRecorded:null,el:{panel:null,head:null,body:null,button:null}},b=(...t)=>console.debug("[BONK]",...t),k=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function Cr(t){let e=Math.max(0,Math.floor((Number(t)||0)/1e3));return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}function Q(t){let e=String(t||"").trim();return e?e.startsWith("https://")?e:e.startsWith("spotify:image:")?`https://i.scdn.co/image/${e.slice(14)}`:/^[0-9a-f]{40}$/i.test(e)?`https://i.scdn.co/image/${e}`:"":""}function hn(t){return(String(t||"?").trim()[0]||"?").toUpperCase()}function mn(t){let e=0;for(let r of String(t||"?"))e=e*31+r.charCodeAt(0)|0;return`hsl(${Math.abs(e)%360} 52% 34%)`}function wr(){let t=crypto.getRandomValues(new Uint8Array(6));return Array.from(t,e=>yr[e%yr.length]).join("")}function Ee(t){return String(t||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8)}var At="bonk.duo",$t="bonk.duo.bak",Mr="bonk.autojoin";function gn(){try{return window.localStorage.getItem(Mr)==="1"}catch{return!1}}function bn(){try{window.localStorage.setItem(Mr,o.autoJoin?"1":"0")}catch(t){b("autojoin storage",t)}}function _r(t){try{let e=window.localStorage.getItem(t);if(!e)return null;let r=JSON.parse(e);return r?.code?{code:String(r.code),partnerName:String(r.partnerName||""),partnerUser:String(r.partnerUser||"")}:null}catch{return null}}function Ar(t){try{if(!t){window.localStorage.removeItem(At),window.localStorage.removeItem($t);return}let e=JSON.stringify(t);window.localStorage.setItem(At,e),window.localStorage.setItem($t,e),G()&&$e(!0)}catch(e){b("duo storage",e)}}function yn(){let t=_r(At);if(t)return t;let e=_r($t);return e?(b("duo restaur\xE9 depuis la sauvegarde",e.code),Ar(e),e):null}function zt(){Ar(o.duo||null)}function Me(t){o.duo=t,zt(),Wt(),g()}function ce(){return!!(o.duo?.code&&o.duo?.partnerUser)}function Ae(){return!!(o.duo&&o.duoPaused&&!o.following)}function vn(t){let e=2166136261;for(let r=0;r<t.length;r+=1)e^=t.charCodeAt(r),e=Math.imul(e,16777619);return(e>>>0).toString(16).padStart(8,"0")}function kn(){let t=String(o.me?.username||"").trim().toLowerCase(),e=String(o.duo?.partnerUser||"").trim().toLowerCase();if(!t||!e)return"";let[r,n]=t<e?[t,e]:[e,t];return vn(`${r}|${n}`)}function $r(t,e){let r=String(t||"").trim().toLowerCase().slice(0,60);if(!o.duo||!r)return!1;let n=String(e||"").slice(0,40);if(o.duo.partnerUser===r&&o.duo.partnerName===n)return!1;let i=!o.duo.partnerUser;return o.duo={...o.duo,partnerUser:r,partnerName:n||o.duo.partnerName||""},zt(),Wt(),i&&v(`Duo cr\xE9\xE9 avec ${o.duo.partnerName||"ton bin\xF4me"}`),g(),!0}function Or(t){return`${Nt}duo-${String(t).toLowerCase()}`}function Ft(){return o.duo?.partnerName?o.duo.partnerName:o.members.find(e=>e.id===o.authority&&e.id!==o.peerId)?.name||"Ton bin\xF4me"}function Lr(t){!o.duo||!t||o.duo.partnerName===t||(o.duo={...o.duo,partnerName:t},zt())}function J(){!o.duo||o.joined||o.busy||o.connectingDuo||(o.connectingDuo=!0,o.error="",g(),Kt({duo:!0,code:o.duo.code,quiet:!0}),window.setTimeout(()=>{if(!(o.joined||!o.connectingDuo)){if(o.pendingPeer){try{o.pendingPeer.destroy()}catch{}o.pendingPeer=null}o.connectingDuo=!1,g()}},9e3))}function xn(){let t=wr();Me({code:t,partnerName:""}),o.duoPaused=!1,J(),v(`Code duo ${t} \u2014 partage-le avec ton bin\xF4me`)}function jr(){let t=Ee(o.duoInput||"");if(t.length<6){o.error="Le code duo fait 6 caract\xE8res.",g();return}Me({code:t,partnerName:""}),o.duoPaused=!1,J()}function Sr(){o.mode==="duo"&&qt(!0,!0),Me(null),o.duoPaused=!1,Tn(),g()}var Cn="https://site-a91ec02422f5470481e7129658fcceb1.freebuff.page/v1/duo",Br="bonk.duo.k",Y="";function G(){if(Y)return Y;try{Y=window.localStorage.getItem(Br)||""}catch{Y=""}return Y}async function _n(){let t=String(o.me?.username||"").trim().toLowerCase();if(!t)return"";let e=globalThis.crypto?.subtle;if(!e)return"";try{let r=await e.digest("SHA-256",new TextEncoder().encode(`bonk-account|${t}`)),n=[...new Uint8Array(r)].map(i=>i.toString(16).padStart(2,"0")).join("");Y=n;try{window.localStorage.setItem(Br,n)}catch{}return n}catch(r){return b("cloud key",r),""}}async function Ur({restore:t=!0}={}){let e=await _n();return e?(document.getElementById("bonk-panel")&&g(),o.duo?$e(!0):t?Nr(e,!0):!1):!1}async function Jt(t,e){let r=globalThis.fetch;if(typeof r!="function")throw new Error("fetch indisponible");let n=await r(Cn+t,e),i=null;try{i=await n.json()}catch{i=null}return{ok:n.ok,status:n.status,data:i}}async function $e(t=!1){let e=G();if(!e||!o.duo)return!1;try{let{ok:r}=await Jt("",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({k:e,code:o.duo.code,partner:o.duo.partnerName||"",partnerUser:o.duo.partnerUser||"",stats:o.stats.slice(-300)})});if(!r)throw new Error("http "+r);return t||v("Duo sauvegard\xE9 en ligne"),!0}catch(r){return b("cloud push",r),t||v("Sauvegarde impossible (hors ligne ?)",!0),!1}}var Mt=0;function Sn(){Mt||(Mt=window.setTimeout(()=>{Mt=0,o.duo&&$e(!0)},15e3))}async function Tn(){let t=G();if(!t)return!1;try{let{ok:e}=await Jt("",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({k:t,code:"",partner:""})});return e}catch(e){return b("cloud forget",e),!1}}async function Nr(t,e=!1){if(!t)return!1;try{let{ok:r,data:n}=await Jt(`?k=${encodeURIComponent(t)}`);return!r||!n?.code?(e||v("Aucune sauvegarde pour cette phrase",!0),!1):(Me({code:String(n.code),partnerName:String(n.partner||""),partnerUser:String(n.partner_user||"").toLowerCase()}),Gn(Array.isArray(n.stats)?n.stats:[]),o.duoPaused=!1,J(),v("Duo restaur\xE9 depuis la sauvegarde"),!0)}catch(r){return b("cloud restore",r),e||v("R\xE9cup\xE9ration impossible (hors ligne ?)",!0),!1}}function Ot(){let t=!!G();return`
    <div class="bonk-cloud">
      <span class="bonk-cloud-head">${C.cloud} Sauvegarde en ligne${t?"":" \xB7 en attente du compte"}</span>
      <span class="bonk-cloud-note">${t?"Automatique sur ton compte Spotify : le duo revient m\xEAme apr\xE8s une r\xE9installation.":"S'active d\xE8s que ton compte Spotify est reconnu."}</span>
      ${t&&!o.duo?'<div class="bonk-actions"><button class="bonk-mini bonk-mini-ghost" data-act="cloud-restore">R\xE9cup\xE9rer</button></div>':""}
    </div>`}function Rn(){if(o.following=!0,o.applyingUntil=Date.now()+2e3,o.hasRemote&&Oe({t:"state",track:{...o.remote},playing:o.remote.playing,progress:o.remote.progress,ts:Date.now()}),o.role==="host"){let t=o.conns.get(o.authority);t&&_(t,{t:"sync"})}else _(o.hostConn,{t:"sync"});g()}function zr(){if(!o.joined)return;o.following=!1,o.authority=o.peerId;let t={t:"claim",from:o.peerId};o.role==="host"?(O(t),B()):_(o.hostConn,t),M(),g()}function Pn(t){if(!t?.uri)return;let e=Date.now();o.lastNotify.uri===t.uri&&e-o.lastNotify.at<12e4||(o.lastNotify={uri:t.uri,at:e},v(`${Ft()} \xE9coute \xAB ${t.name} \xBB`),En())}function En(){let t=o.el.button;t&&(t.classList.add("bonk-trigger-ping"),window.setTimeout(()=>t.classList.remove("bonk-trigger-ping"),6e3))}function v(t,e=!1){let r=`BONK \xB7 ${String(t??"").replace(/<[^>]*>/g,"")}`;try{window.Spicetify.showNotification(r,e,e?"error":"check")}catch{b(r)}}async function Dn(t,e=3e4){let r=Date.now();for(;Date.now()-r<e;){try{if(t())return!0}catch{}await new Promise(n=>setTimeout(n,150))}return!1}var T=()=>window.Spicetify?.Player;function Gt(){try{return T().data?.item?.uri??null}catch{return null}}function H(){try{return!!T().isPlaying()}catch{return!1}}function De(){try{return Number(T().getProgress())||0}catch{return 0}}var F={uri:null,raw:-1,at:0,playing:!1};function Tr(){let t=De(),e=H(),r=Gt(),n=Date.now();return(r!==F.uri||!e||t!==F.raw)&&(F.uri=r,F.raw=t,F.at=n,F.playing=e),e?t+Math.min(Math.max(0,n-F.at),1e3):t}function In(){try{return Number(T().getDuration())||0}catch{return 0}}function Ht(){let t;try{t=T().data?.item}catch{t=null}if(!t)return null;let e=t.metadata||{};return{uri:t.uri,name:t.name||e.title||"Titre inconnu",artist:e.artist_name||e.artists||e.album_artist_name||"",art:Q(e.image_xlarge_url||e.image_large_url||e.image_url||t.album?.images?.[0]?.url),duration:In()||Number(t.duration?.milliseconds)||0}}function wn(t){try{return Promise.resolve(T().playUri(t)).catch(e=>b("playUri",e))}catch(e){return b("playUri sync",e),Promise.resolve()}}async function Ie(t){let e=window.Spicetify,r=[()=>e.addToQueue?.([{uri:t}]),()=>e.addToQueue?.([t]),()=>e.Platform?.PlayerAPI?.addToQueue?.([{uri:t}])];for(let n of r)try{let i=n();if(i)return await i,v("Ajout\xE9 \xE0 la file d'attente"),!0}catch(i){b("queue",i)}return v("Impossible d'ajouter \xE0 la file d'attente",!0),!1}function x(){return o.joined&&!!o.peerId&&o.peerId===o.authority}function _(t,e){if(t?.open)try{t.send(e)}catch(r){b("send",r)}}function O(t,e){o.conns.forEach((r,n)=>{n!==e&&_(r,t)})}function Lt(){return{t:"state",track:Ht(),playing:H(),progress:De(),ts:Date.now(),authority:o.authority}}function M(){if(!x()||Ae())return;o.lastPush=Date.now();let t=Lt();o.role==="host"?O(t):_(o.hostConn,t),Mn(t),Jr(t.track,o.me.name)}function Mn(t){t.track&&(o.remote={...t.track,playing:t.playing,progress:t.progress,at:Date.now()},o.hasRemote=!0)}function B(){O({t:"members",members:o.members,authority:o.authority})}function An(t){return!o.autoJoin||!o.duo||o.mode!=="duo"||!o.joined||o.authority&&o.authority===o.peerId||!t?.track?.uri||!t.playing?!1:(o.duoPaused=!1,o.following=!0,o.applyingUntil=Date.now()+2200,v("Tu as rejoint ton duo"),g(),!0)}function Rr(){o.duo&&(o.duoPaused=!1,o.following=!0,o.applyingUntil=Date.now()+2200,o.hasRemote&&o.remote?.uri&&Oe({track:o.remote,playing:o.remote.playing,progress:o.remote.progress+(o.remote.playing?Date.now()-o.remote.at:0),ts:Date.now(),authority:o.authority}),g())}function Oe(t){if(!t)return;if(!t.track){o.remote={uri:null,name:"",artist:"",art:"",duration:0,playing:!1,progress:0,at:Date.now()},o.hasRemote=!0,$();return}let e=!!t.playing,r=Number(t.ts)||Date.now(),n=Number(t.progress)||0;if(o.remote={...t.track,playing:e,progress:n,at:Date.now()},o.hasRemote=!0,t.authority&&(o.authority=t.authority),x()){$();return}if(!o.following&&(e&&Pn(t.track),!An(t))){$();return}o.applyingUntil=Date.now()+2200,Jr(t.track,o.members.find(s=>s.id===o.authority)?.name||Ft());let i=n+(e?Math.max(0,Date.now()-r):0);try{let s=Gt();t.track.uri&&s!==t.track.uri?wn(t.track.uri).then(()=>{window.setTimeout(()=>{try{T().seek(Math.max(0,i))}catch{}},700)}):e!==H()?e?(T().play(),Math.abs(De()-i)>vr&&T().seek(i)):T().pause():e&&Math.abs(De()-i)>vr&&T().seek(i)}catch(s){b("apply",s)}$()}function Pr(t){if(!(!o.joined||Ae())){if(Date.now()<o.applyingUntil){$();return}if(x()){M(),$();return}if(t){zr();return}$()}}function $n(t,e){if(!(!e||typeof e!="object"))switch(e.t){case"hello":{o.conns.set(t.peer,t);let r=String(e.name||"Auditeur").slice(0,40),n=String(e.image||"");o.members=[...o.members.filter(i=>i.id!==t.peer),{id:t.peer,name:r,image:n}],o.mode==="duo"&&(Lr(r),e.duo&&e.username&&$r(e.username,r)),_(t,{t:"welcome",code:o.code,authority:o.authority,hostName:o.me.name,hostUser:o.me.username||"",members:o.members}),B(),x()?_(t,Lt()):o.hasRemote&&_(t,{t:"state",...o.remote,ts:Date.now()}),v(o.mode==="duo"?`${r} est l\xE0`:`${r} a rejoint la session`),g();break}case"state":{if(o.authority!==t.peer)return;Oe(e),O(e,t.peer);break}case"sync":{if(x())_(t,Lt());else{let r=o.conns.get(o.authority);r?_(r,{t:"sync"}):o.hasRemote&&_(t,{t:"state",...o.remote,ts:Date.now()})}break}case"queue":{if(x())Ie(e.uri);else{let r=o.conns.get(o.authority);r&&_(r,{t:"add",uri:e.uri})}break}case"claim":{if(!e.from)return;if(o.authority=e.from,o.following=e.from!==o.peerId,O({t:"claim",from:e.from},t.peer),B(),e.from!==o.peerId){let r=o.members.find(n=>n.id===e.from);v(`${r?.name??"Ton duo"} est l'h\xF4te`)}g();break}case"control":{let r=String(e.authority||"");if(!r)return;o.authority=r,o.following=r!==o.peerId,O({t:"control",authority:r},t.peer),B(),x()&&M(),g();break}case"bye":{jt(t.peer);break}case"profile":{let r=o.members.find(n=>n.id===t.peer);if(!r)break;e.name&&(r.name=String(e.name).slice(0,40)),e.image&&(r.image=Q(e.image)),B(),g();break}default:break}}function On(t){if(!(!t||typeof t!="object"))switch(t.t){case"welcome":{o.code=t.code||o.code,o.authority=t.authority||"",o.hostName=t.hostName||"l'h\xF4te",o.members=t.members||[],o.joined=!0,o.busy=!1,o.connectingDuo=!1,o.error="",o.following=o.authority!==o.peerId,o.mode==="duo"&&(Lr(o.hostName),t.hostUser&&$r(t.hostUser,o.hostName)),g(),_(o.hostConn,{t:"sync"});break}case"members":{o.members=t.members||[],t.authority&&(o.authority=t.authority),g();break}case"profile":{let e=o.members.find(r=>r.id===conn.peer);if(!e)break;t.name&&(e.name=String(t.name).slice(0,40)),t.image&&(e.image=Q(t.image)),g();break}case"claim":{if(!t.from)return;if(o.authority=t.from,o.following=t.from!==o.peerId,t.from!==o.peerId){let e=o.members.find(r=>r.id===t.from);v(`${e?.name??"Ton duo"} est l'h\xF4te`)}g();break}case"control":{t.authority&&(o.authority=t.authority),o.following=o.authority!==o.peerId,v(x()?"Tu es l'h\xF4te":"L'h\xF4te a chang\xE9"),g(),x()&&M();break}case"state":Oe(t);break;case"add":x()&&Ie(t.uri);break;case"sync":x()&&M();break;default:break}}function jt(t){o.conns.delete(t),o.members=o.members.filter(e=>e.id!==t),o.authority===t&&(o.authority=o.peerId,o.following=!1,O({t:"control",authority:o.authority}),M()),B(),g()}function Fr(t){let e=t?new wt(t,kr):new wt(void 0,kr);return e.on("disconnected",()=>{try{e.reconnect()}catch(r){b("reconnect",r)}}),e}function Kt(t={},e=0){if(o.joined)return;let r=!!t.duo,n=t.code||wr();t.quiet||(o.busy=!0),o.error="",g();let i=r?Or(n):Nt+n.toLowerCase(),s;try{s=Fr(i),o.pendingPeer=s}catch{o.busy=!1,o.error="Impossible de cr\xE9er la session (WebRTC indisponible).",g();return}s.on("open",()=>{o.peer=s,o.pendingPeer=null,o.role="host",o.mode=r?"duo":"manual",o.following=!1,o.connectingDuo=!1,o.code=n,o.peerId=i,o.authority=i,o.hostName=o.me.name,o.members=[{id:i,name:o.me.name,image:o.me.image}],o.joined=!0,o.busy=!1,o.error="",r||v(`Session ${n} ouverte`),g(),M()}),s.on("connection",a=>{a.on("open",()=>{o.conns.set(a.peer,a),g()}),a.on("data",c=>$n(a,c)),a.on("close",()=>jt(a.peer)),a.on("error",c=>{b("conn",c),jt(a.peer)})}),s.on("error",a=>{let c=a?.type;if(c==="unavailable-id"&&r){o.pendingPeer=null;try{s.destroy()}catch{}Vt(n,{duo:!0,quiet:!0});return}if(c==="unavailable-id"&&e<4){try{s.destroy()}catch{}Kt(t,e+1);return}if(o.joined){b("peer error",a);return}o.pendingPeer=null,o.busy=!1,o.connectingDuo=!1,o.error=c==="network"||c==="server-error"?"Serveur de connexion injoignable. V\xE9rifie ta connexion.":a?.message||"Impossible de cr\xE9er la session.",g(),r&&window.setTimeout(()=>{o.duo&&!o.joined&&!o.connectingDuo&&!o.duoPaused&&J()},1500)})}function Vt(t,e={}){if(o.joined||o.busy)return;let r=!!e.duo,n=Ee(t);if(n.length<4){o.error=r?"Code duo invalide.":"Entre un code de session valide.",o.connectingDuo=!1,g();return}e.quiet||(o.busy=!0),o.error="",g();let i;try{i=Fr()}catch{o.busy=!1,o.error="Impossible de se connecter (WebRTC indisponible).",g();return}let s=!1,a=window.setTimeout(()=>{if(!s){s=!0,o.busy=!1,o.error="Connexion impossible : r\xE9seau trop restrictif (NAT). Essaie un autre r\xE9seau.";try{i.destroy()}catch{}g()}},2e4);i.on("open",()=>{let c=i.connect(r?Or(n):Nt+n.toLowerCase(),{reliable:!0});o.hostConn=c,c.on("open",()=>{s=!0,window.clearTimeout(a),o.peer=i,o.role="guest",o.mode=r?"duo":"manual",o.code=n,o.peerId=i.id,o.connectingDuo=!1,_(c,{t:"hello",name:o.me.name,image:o.me.image,duo:r,username:o.me.username||""}),g(),window.setTimeout(()=>{o.joined||(o.busy=!1,o.error="L'h\xF4te ne r\xE9pond pas. V\xE9rifie le code et r\xE9essaie.",we(),g())},6e3)}),c.on("data",l=>On(l)),c.on("close",()=>{o.joined&&(we(),o.error="Connexion perdue avec l'h\xF4te.",g(),v("Connexion perdue avec l'h\xF4te",!0))})}),i.on("error",c=>{let l=c?.type;if(o.joined){b("peer error",c);return}if(window.clearTimeout(a),s=!0,o.busy=!1,o.connectingDuo=!1,r){try{i.destroy()}catch{}g();return}l==="peer-unavailable"?o.error=`Aucune session active avec le code ${n}.`:l==="network"||l==="server-error"?o.error="Serveur de connexion injoignable. V\xE9rifie ta connexion.":o.error=c?.message||"Connexion impossible.";try{i.destroy()}catch{}g()})}function we(){if(o.joined=!1,o.busy=!1,o.role=null,o.mode="manual",o.following=!1,o.connectingDuo=!1,o.pendingPeer){try{o.pendingPeer.destroy()}catch{}o.pendingPeer=null}if(o.code="",o.peerId="",o.authority="",o.hostName="",o.members=[],o.conns.clear(),o.hostConn=null,o.hasRemote=!1,o.copied=null,o.peer){try{o.peer.destroy()}catch{}o.peer=null}}function qt(t=!1,e=!1){if(!o.joined){we(),g();return}if(o.mode==="duo"&&o.duo&&!e){o.following=!1,o.duoPaused=!0,t||v("Tu as quitt\xE9 la session \xB7 le duo reste connect\xE9"),g();return}let r=o.role==="host";o.mode==="duo"&&(o.duoPaused=!0),r?O({t:"bye"}):_(o.hostConn,{t:"bye"}),we(),g(),t||v(r?"Session termin\xE9e":"Tu as quitt\xE9 la session")}function Ln(t){if(!o.joined||o.role!=="host"&&!x())return;let e=t===o.peerId?o.peerId:t;if(!e||e===o.authority)return;o.authority=e,o.following=e!==o.peerId;let r={t:"control",authority:e};o.role==="host"?(O(r),B()):_(o.hostConn,r),x()&&M(),g();let n=o.members.find(i=>i.id===e);v(e===o.peerId?"Tu es l'h\xF4te":`${n?.name??"Ton duo"} est l'h\xF4te`)}function jn(t){if(!(!o.joined||!t)){if(x()){Ie(t);return}if(o.role==="host"){let e=o.conns.get(o.authority);e?_(e,{t:"add",uri:t}):Ie(t);return}_(o.hostConn,{t:"queue",uri:t}),v("Demande envoy\xE9e")}}function Bn(){if(o.role==="host"){let t=o.conns.get(o.authority);t&&_(t,{t:"sync"})}else _(o.hostConn,{t:"sync"});v("Resynchronisation\u2026")}function Yt(){if(x())return{track:Ht(),playing:H(),progress:Tr(),canControl:!0};let t=o.remote,e=t.playing?Date.now()-t.at:0,r=!!(o.following&&t.uri&&Gt()===t.uri);return{track:t.uri?{uri:t.uri,name:t.name,artist:t.artist,art:t.art,duration:t.duration}:null,playing:r?H():t.playing,progress:r?Tr():t.progress+e,canControl:!1}}function Un(t){return t.image?`<img class="bonk-avatar" src="${k(t.image)}" alt="" />`:`<span class="bonk-avatar bonk-initial" style="background:${mn(t.name)}">${k(hn(t.name))}</span>`}function Nn(){let t=o.members.find(r=>r.id===o.authority),e="\xC9couter ensemble";return o.joined?x()?e=o.role==="host"&&o.mode==="manual"?`Tu es l'h\xF4te \xB7 ${o.members.length} connect\xE9(s)`:"Tu es l'h\xF4te":o.mode==="duo"?e=`H\xF4te : ${t?.name??Ft()}`:e=`H\xF4te : ${t?.name??(o.hostName||"en attente")}`:o.connectingDuo?e="Connexion au duo\u2026":o.busy&&(e="Connexion\u2026"),`
    <div class="bonk-brand">
      <span class="bonk-mark">${C.jam}</span>
      <span class="bonk-brand-text">
        <span class="bonk-title">BONK</span>
        <span class="bonk-subtitle">${k(e)}</span>
      </span>
    </div>
    <div class="bonk-head-actions">
      ${o.joined?`<span class="bonk-status ${x()?"live":""}"></span>`:""}
      <button class="bonk-icon-btn" data-act="close" title="Fermer">${C.close}</button>
    </div>`}function zn(){return o.duo&&!ce()?Kn():`
    <div class="bonk-hero">
      <div class="bonk-hero-mark">${C.jam}</div>
      <h2>\xC9coutez ensemble</h2>
      <p>Lance une session, partage le code, et choisis qui est l'h\xF4te. Tout le monde entend le m\xEAme morceau, au m\xEAme moment.</p>
    </div>
    <button class="bonk-btn bonk-primary" data-act="create" ${o.busy?"disabled":""}>
      ${o.busy?"Ouverture\u2026":"Cr\xE9er une session"}
    </button>
    <div class="bonk-divider"><span>ou rejoindre</span></div>
    <div class="bonk-join">
      <input id="bonk-code" class="bonk-input" placeholder="CODE" maxlength="8" autocomplete="off" spellcheck="false"
        value="${k(o.input)}" ${o.busy?"disabled":""} />
      <button class="bonk-btn" data-act="join" ${o.busy?"disabled":""}>Rejoindre</button>
    </div>
    ${o.error?`<div class="bonk-error">${k(o.error)}</div>`:""}
    ${Vn()}
    ${Gr()}`}var Fn="bonk.stats.",ae=800;function Qt(){let t=kn();return t?Fn+t:""}function Wt(){o.stats=Jn(),o.statsOpen=!1,o.lastRecorded=null,$()}function Jn(){let t=Qt();if(!t)return[];try{let e=window.localStorage.getItem(t);if(!e)return[];let r=JSON.parse(e);return Array.isArray(r?.plays)?r.plays.filter(n=>n&&n.u):[]}catch{return[]}}function Xt(){let t=Qt();if(t){try{window.localStorage.setItem(t,JSON.stringify({v:1,plays:o.stats.slice(-ae)}))}catch(e){b("stats storage",e)}Sn()}}function Gn(t){if(!Qt()||!Array.isArray(t)||!t.length)return;let e=new Set(o.stats.map(n=>`${n.u}|${n.t}`)),r=0;for(let n of t){if(!n?.u)continue;let i=`${n.u}|${n.t}`;e.has(i)||(e.add(i),o.stats.push(n),r+=1)}r&&(o.stats.sort((n,i)=>(Number(n.t)||0)-(Number(i.t)||0)),o.stats.length>ae&&(o.stats=o.stats.slice(-ae)),Xt(),$())}function Jr(t,e){!t?.uri||!String(t.uri).startsWith("spotify:track:")||o.mode!=="duo"||Ae()||!ce()||o.lastRecorded!==t.uri&&(o.lastRecorded=t.uri,o.stats.push({u:t.uri,n:t.name||"",a:t.artist||"",i:t.art||"",d:Number(t.duration)||0,t:Date.now(),by:e||""}),o.stats.length>ae&&(o.stats=o.stats.slice(-ae)),Xt(),$())}function Er(t){let e=Math.round((Number(t)||0)/6e4);if(e<60)return`${e} min`;let r=(Number(t)||0)/36e5;return`${r.toFixed(r<10?1:0)} h`}function Hn(){let t=new Map,e=new Map,r=0;for(let n of o.stats){let i=t.get(n.u)||{uri:n.u,name:n.n,artist:n.a,art:n.i,count:0};i.count+=1,t.set(n.u,i),String(n.a||"").split(",").map(s=>s.trim()).filter(Boolean).forEach(s=>e.set(s,(e.get(s)||0)+1)),r+=Number(n.d)||0}return{plays:o.stats.length,ms:r,unique:t.size,topTracks:[...t.values()].sort((n,i)=>i.count-n.count||n.name.localeCompare(i.name)),topArtists:[...e.entries()].sort((n,i)=>i[1]-n[1]).map(([n,i])=>({name:n,count:i}))}}function Gr(){if(!ce())return"";if(!o.stats.length)return`<div class="bonk-stats-empty">${C.chart} Les stats du duo appara\xEEtront d\xE8s vos premi\xE8res \xE9coutes ensemble.</div>`;let t=Hn(),e=`
    <button class="bonk-stats-head" data-act="stats-toggle">
      <span class="bonk-stats-title">${C.chart} Stats du duo</span>
      <span class="bonk-stats-summary">${t.plays} \xE9coutes \xB7 ${Er(t.ms)}${t.topArtists[0]?` \xB7 ${k(t.topArtists[0].name)}`:""}</span>
      <span class="bonk-chevron">${o.statsOpen?"\u25BE":"\u25B8"}</span>
    </button>`;if(!o.statsOpen)return e;let r=t.topTracks.slice(0,4).map(i=>`
      <div class="bonk-top-row">
        ${i.art?`<img class="bonk-top-art" src="${k(i.art)}" alt="" />`:'<span class="bonk-top-art"></span>'}
        <span class="bonk-top-info"><b>${k(i.name)}</b><small>${k(i.artist)}</small></span>
        <span class="bonk-count">${i.count}\xD7</span>
      </div>`).join(""),n=t.topArtists.slice(0,5).map(i=>`<span class="bonk-chip">${k(i.name)} <b>${i.count}</b></span>`).join("");return`${e}
    <div class="bonk-stats-grid">
      <div><b>${t.plays}</b><small>\xE9coutes</small></div>
      <div><b>${Er(t.ms)}</b><small>ensemble</small></div>
      <div><b>${t.unique}</b><small>titres</small></div>
    </div>
    <div class="bonk-section"><span>Top titres</span></div>
    <div class="bonk-top">${r}</div>
    <div class="bonk-section"><span>Artistes</span></div>
    <div class="bonk-chips">${n}</div>
    <div class="bonk-stats-actions"><button class="bonk-mini bonk-mini-ghost" data-act="stats-reset">R\xE9initialiser</button></div>`}function Kn(){return`
    <div class="bonk-hero">
      <div class="bonk-hero-mark">${C.jam}</div>
      <h2>Duo en attente</h2>
      <p>Ton duo existera d\xE8s que l'autre personne aura saisi ce code. Les stats d\xE9marreront \xE0 ce moment-l\xE0.</p>
    </div>
    <div class="bonk-duo-code bonk-duo-code-big">
      <span class="bonk-code-label">Code duo</span>
      <b>${k(o.duo?.code||"")}</b>
      <button class="bonk-mini bonk-mini-ghost" data-act="duo-copy">${o.copied?"copi\xE9":"copier"}</button>
    </div>
    <div class="bonk-hint">${C.note} ${o.joined?"En attente de ton bin\xF4me":o.connectingDuo?"Ouverture\u2026":"En veille"}</div>
    <button class="bonk-btn bonk-ghost bonk-full" data-act="duo-cancel">Annuler l'invitation</button>
    ${Ot()}`}function Vn(){if(ce()){let t=o.duo.partnerName||"en attente de l'autre c\xF4t\xE9",e=o.connectingDuo?"Connexion\u2026":o.duoPaused?"En pause":o.joined?"Connect\xE9":"En veille";return`
      <div class="bonk-duo">
        <span class="bonk-duo-icon">${C.note}</span>
        <span class="bonk-duo-text">
          <b>Duo \xB7 ${k(t)}</b>
          <small>${k(e)} \xB7 reconnexion automatique</small>
        </span>
        <div class="bonk-actions">
          ${o.duoPaused&&!o.following?'<button class="bonk-mini" data-act="duo-reconnect">Reprendre</button>':""}
          <button class="bonk-mini ${o.confirmUnlink?"bonk-mini-danger":"bonk-mini-ghost"}" data-act="duo-leave">${o.confirmUnlink?"Confirmer":"D\xE9lier"}</button>
        </div>
      </div>
      <div class="bonk-duo-code">
        <span class="bonk-code-label">Code duo</span>
        <b>${k(o.duo.code)}</b>
        <button class="bonk-mini bonk-mini-ghost" data-act="duo-copy">${o.copied?"copi\xE9":"copier"}</button>
      </div>
      ${o.joined&&o.remote?.uri&&o.authority&&o.authority!==o.peerId?`<div class="bonk-duo-live">
              <span class="bonk-duo-live-text">${C.note} ${k(`${o.members.find(r=>r.id===o.authority)?.name??"Ton duo"} \xE9coute ${o.remote.name||"un titre"}`)}</span>
              <button class="bonk-mini" data-act="duo-follow">Rejoindre</button>
            </div>`:""}
      <button class="bonk-mini ${o.autoJoin?"bonk-mini-on":"bonk-mini-ghost"}" data-act="autojoin">
        ${o.autoJoin?"Rejoindre auto \xB7 oui":"Rejoindre auto \xB7 non"}
      </button>
      ${Ot()}`}return`
    <div class="bonk-divider"><span>toujours ensemble</span></div>
    <div class="bonk-join">
      <input id="bonk-duo-input" class="bonk-input" placeholder="CODE DUO" maxlength="8" autocomplete="off" spellcheck="false"
        value="${k(o.duoInput)}" ${o.busy?"disabled":""} />
      <button class="bonk-btn" data-act="duo-join" ${o.busy?"disabled":""}>Activer</button>
    </div>
    <button class="bonk-btn bonk-ghost bonk-full" data-act="duo-create">Cr\xE9er un duo permanent</button>
    ${Ot()}
    <div class="bonk-hint">${C.note} Un code une fois, puis connexion automatique</div>`}function qn(){let t=Yt(),e=t.track,r=t.canControl,n=o.role==="host",s=o.members.find(c=>c.id===o.authority)?.name??"l'h\xF4te",a=o.members.map(c=>{let l=c.id===o.peerId,u=c.id===o.authority,p=!l&&(x()||n&&o.mode==="manual")?`<button class="bonk-mini ${u?"bonk-mini-ghost":""}" data-act="give" data-id="${k(c.id)}"
             title="${u?"Reprendre le r\xF4le d'h\xF4te":"Passer le r\xF4le d'h\xF4te"}">${u?"Reprendre":"Passer l'h\xF4te"}</button>`:"";return`
        <div class="bonk-member ${u?"bonk-member-host":""}">
          ${Un(c)}
          <span class="bonk-member-name">${k(c.name)}${l?"<em> toi</em>":""}</span>
          ${u?`<span class="bonk-tag bonk-tag-host">${C.crown} h\xF4te</span>`:'<span class="bonk-tag">auditeur</span>'}
          ${p}
        </div>`}).join("");return`
    <div class="bonk-np">
      <div class="bonk-art">
        ${e?.art?`<img src="${k(e.art)}" alt="" />`:'<span class="bonk-art-ph">\u266A</span>'}
        ${t.playing?'<span class="bonk-eq"><i></i><i></i><i></i><i></i></span>':""}
      </div>
      <div class="bonk-np-info">
        <span class="bonk-np-label">${t.playing?"En lecture":e?"En pause":"En attente"}</span>
        <span class="bonk-np-title">${k(e?.name??"Rien en lecture")}</span>
        <span class="bonk-np-artist">${k(e?.artist??"Lance un morceau dans Spotify")}</span>
      </div>
    </div>

    <div class="bonk-progress ${r?"bonk-progress-live":""}" data-act="${r?"seek":""}">
      <div class="bonk-progress-fill"></div>
    </div>
    <div class="bonk-times"><span class="bonk-cur">0:00</span><span class="bonk-dur">0:00</span></div>

    ${r?`<div class="bonk-transport">
             <button class="bonk-round" data-act="prev" title="Pr\xE9c\xE9dent">${C.prev}</button>
             <button class="bonk-round bonk-play" data-act="toggle" title="Lecture / pause">${t.playing?C.pause:C.play}</button>
             <button class="bonk-round" data-act="next" title="Suivant">${C.next}</button>
           </div>`:`<div class="bonk-host-note">${C.crown} H\xF4te <b>${k(s)}</b></div>
           <div class="bonk-actions">
             ${o.following?`<button class="bonk-mini bonk-mini-ghost" data-act="resync">${C.refresh} Resynchroniser</button>
                    <button class="bonk-mini bonk-mini-ghost" data-act="unfollow">Me d\xE9synchroniser</button>`:`<button class="bonk-mini" data-act="follow">${C.headphones} \xC9couter avec</button>`}
             <button class="bonk-mini bonk-mini-ghost" data-act="claim">Prendre l'h\xF4te</button>
           </div>`}

    ${n?`<button class="bonk-code" data-act="copy" title="Copier le code">
             <span class="bonk-code-label">Code</span>
             <span class="bonk-code-value">${k(o.code)}</span>
             <span class="bonk-code-action">${o.copied?C.check+" copi\xE9":C.copy}</span>
           </button>`:""}

    <div class="bonk-section"><span>Membres</span><span>${o.members.length}</span></div>
    <div class="bonk-members">${a}</div>
    ${Gr()}
    ${o.error?`<div class="bonk-error">${k(o.error)}</div>`:""}
    <button class="bonk-btn bonk-ghost bonk-full" data-act="leave">${n?"Terminer la session":"Quitter la session"}</button>`}function Hr(){let t=Yt();return[t.track?.uri||"",t.playing?1:0,o.members.map(e=>`${e.id}:${e.name}`).join(","),o.authority,o.error,o.copied?"copied":"",o.joined?"joined":"idle",o.busy?"busy":"",o.following?"following":"free",o.duo?`duo:${o.duo.code}:${o.duo.partnerName}`:"noduo",o.autoJoin?"autojoin":"",o.statsOpen?"stats-open":"stats-closed",`plays:${o.stats.length}`,o.lastRecorded||"",o.connectingDuo?"connecting":"",o.duoPaused?"paused":"",o.confirmUnlink?"confirm-unlink":"",G()?"cloud-on":"cloud-off",Yn()].join("|")}function Yn(){return x()?"host":"listener"}function $(){o.el.panel&&Hr()!==o.sig&&g()}function g(){if(!o.el.panel)return;o.sig=Hr(),o.el.panel.classList.toggle("bonk-open",o.open),o.el.button&&o.el.button.classList.toggle("bonk-trigger-on",o.open),o.el.head.innerHTML=Nn();let t=!!(o.duo&&!ce());o.el.body.innerHTML=o.joined&&!t&&!Ae()?qn():zn(),Zt(),Qn()}function Kr(){if(!o.open||!o.el.panel){o.progressRaf=0;return}Zt();let t=window.requestAnimationFrame||(e=>window.setTimeout(e,16));o.progressRaf=t.call(window,Kr)}function Qn(){if(o.progressRaf||!o.open||!o.el.panel)return;let t=window.requestAnimationFrame||(e=>window.setTimeout(e,16));o.progressRaf=t.call(window,Kr)}function Zt(){let t=o.el.panel;if(!t)return;let e=t.querySelector(".bonk-progress-fill");if(!e)return;let r=Yt(),n=r.track?.duration||0,i=n>0?Math.min(100,Math.max(0,r.progress/n*100)):0;e.style.width=`${i}%`;let s=t.querySelector(".bonk-cur"),a=t.querySelector(".bonk-dur");s&&(s.textContent=Cr(r.progress)),a&&(a.textContent=Cr(n))}function Wn(){if(document.getElementById("bonk-styles"))return;let t=document.createElement("style");t.id="bonk-styles",t.textContent=`@font-face{font-family:"BONK Display";src:url("${br}") format("woff2");font-weight:400;font-display:swap;}${gr}`,document.head.appendChild(t)}function Xn(){if(document.getElementById("bonk-panel"))return;let t=document.createElement("div");t.id="bonk-panel",t.innerHTML='<div class="bonk-head"></div><div class="bonk-body"></div>',t.addEventListener("click",Zn),t.addEventListener("input",eo),t.addEventListener("keydown",to),document.body.appendChild(t),o.el.panel=t,o.el.head=t.querySelector(".bonk-head"),o.el.body=t.querySelector(".bonk-body")}function Bt(t){o.open=typeof t=="boolean"?t:!o.open,g()}function Zn(t){let e=t.target.closest("[data-act]");if(!e||!o.el.panel.contains(e))return;let r=e.dataset.act;if(r)switch(t.preventDefault(),t.stopPropagation(),r){case"close":Bt(!1);break;case"create":Kt();break;case"join":Vt(o.input||"");break;case"copy":Dr();break;case"leave":qt();break;case"give":Ln(e.dataset.id||o.peerId);break;case"toggle":if(!x())return;try{H()?T().pause():T().play()}catch(n){b(n)}M(),g();break;case"next":if(!x())return;try{T().next?T().next():T().skip()}catch(n){b(n)}window.setTimeout(M,350);break;case"prev":if(!x())return;try{T().back()}catch(n){b(n)}window.setTimeout(M,350);break;case"seek":{if(!x())return;let n=Ht(),i=e.querySelector(".bonk-progress-fill")?e:e.closest(".bonk-progress");if(!i||!n?.duration)return;let s=i.getBoundingClientRect(),a=Math.min(1,Math.max(0,(t.clientX-s.left)/s.width));try{T().seek(Math.round(a*n.duration))}catch(c){b(c)}M(),g();break}case"resync":Bn();break;case"follow":Rn();break;case"unfollow":o.following=!1,g();break;case"claim":zr();break;case"duo-create":xn();break;case"duo-join":jr();break;case"duo-leave":if(!o.confirmUnlink){o.confirmUnlink=!0,g(),window.setTimeout(()=>{o.confirmUnlink&&(o.confirmUnlink=!1,g())},4e3);break}o.confirmUnlink=!1,Sr();break;case"duo-cancel":Sr();break;case"duo-copy":o.duo&&Dr(o.duo.code);break;case"duo-reconnect":Rr(),J();break;case"duo-follow":Rr();break;case"autojoin":o.autoJoin=!o.autoJoin,bn(),g(),v(o.autoJoin?"Rejoindre automatiquement : activ\xE9":"Rejoindre automatiquement : d\xE9sactiv\xE9");break;case"cloud-restore":Ur().then(n=>{!n&&o.duo&&$e()});break;case"stats-toggle":o.statsOpen=!o.statsOpen,g();break;case"stats-reset":o.stats=[],o.lastRecorded=null,Xt(),g(),v("Stats du duo r\xE9initialis\xE9es");break;default:break}}function eo(t){t.target.id==="bonk-code"&&(o.input=Ee(t.target.value)),t.target.id==="bonk-duo-input"&&(o.duoInput=Ee(t.target.value))}function to(t){t.key==="Enter"&&(t.target.id==="bonk-code"&&(t.preventDefault(),Vt(o.input||"")),t.target.id==="bonk-duo-input"&&(t.preventDefault(),jr()))}async function Dr(t=o.code){try{await navigator.clipboard.writeText(t),o.copied=Date.now(),g(),window.setTimeout(()=>{o.copied=null,g()},1600)}catch{v(`Code : ${o.code}`)}}function ro(){let t=window.Spicetify;try{if(t.Playbar?.Button){let e=new t.Playbar.Button("BONK",xr,()=>Bt());e.register(),o.el.button=e.element;return}}catch(e){b("playbar",e)}try{t.Topbar?.Button&&new t.Topbar.Button("BONK",xr,()=>Bt())}catch(e){b("topbar",e)}}function no(){try{new window.Spicetify.ContextMenu.Item("Ajouter \xE0 la session BONK",e=>{(e||[]).filter(r=>String(r).includes(":track:")).forEach(r=>jn(r))},e=>o.joined&&(e||[]).some(r=>String(r).includes(":track:")),"plus-alt").register()}catch(t){b("context menu",t)}}var Vr="bonk.me";function oo(){try{let t=window.localStorage.getItem(Vr),e=t?JSON.parse(t):null;return{name:String(e?.name||"").slice(0,40),image:Q(e?.image),username:String(e?.username||"").slice(0,60)}}catch{return{name:"",image:"",username:""}}}function io(t){try{window.localStorage.setItem(Vr,JSON.stringify({name:t.name,image:t.image,username:t.username||""}))}catch(e){b("me storage",e)}}function Ut(t,e=0){if(!t||typeof t!="object"||e>7)return null;if(Array.isArray(t)){for(let n of t){let i=Ut(n,e+1);if(i)return i}return null}let r=typeof t.uri=="string"?t.uri:"";if(/^spotify:user:/.test(r)||"displayName"in t||"avatar"in t||"profileImage"in t){let n=String(t.displayName||t.name||t.username||"").trim().slice(0,40),i=String(t.username||(r.startsWith("spotify:user:")?r.slice(13):"")).trim().toLowerCase().slice(0,60),s=Q(t.avatar?.url||t.avatar?.uri||t.avatar?.imageUrl||t.avatar?.sources?.[0]?.url||t.profileImage?.url||t.profileImage||t.imageUrl||t.image||(Array.isArray(t.images)?t.images[0]?.url||t.images[0]:""));if(n||s||i)return{name:n,image:s,username:i}}for(let n of Object.keys(t)){let i=Ut(t[n],e+1);if(i)return i}return null}function so(){let t={name:"",image:""};try{let e=document.querySelector('[data-testid="user-widget-link"], .main-userWidget-box, .main-userWidget-user'),r=e?.querySelector("img")||document.querySelector('[data-testid="user-widget-link"] img');t.image=Q(r?.src||r?.getAttribute("src"));let n=e?.getAttribute("aria-label")||e?.querySelector("[aria-label]")?.getAttribute("aria-label")||"",i=String(n).trim();i&&!/^(profil|profile|compte|account|paramètres|settings)/i.test(i)&&(t.name=i.slice(0,40))}catch(e){b("me dom",e)}return t}async function Ir(){let t=oo();o.me={name:t.name,image:t.image,username:t.username};let e=[["UserAPI",()=>window.Spicetify.Platform?.UserAPI?.getUser?.()],["GraphQL",()=>window.Spicetify.GraphQL?.Definitions?.profileAttributes?window.Spicetify.GraphQL.Request(window.Spicetify.GraphQL.Definitions.profileAttributes):null],["identity",()=>window.Spicetify.CosmosAsync?.get?.("sp://identity/v1/profile")],["identity-user",()=>window.Spicetify.CosmosAsync?.get?.("sp://identity/v1/user")]];for(let[n,i]of e){if(o.me.name&&o.me.image)break;try{let s=Ut(await i());if(!s)continue;o.me={name:s.name||o.me.name,image:s.image||o.me.image,username:s.username||o.me.username},b("me",n,o.me.name||"?",o.me.image?"photo":"sans photo")}catch(s){b("me "+n,s)}}if(!o.me.name||!o.me.image){let n=so();o.me={...o.me,name:o.me.name||n.name,image:o.me.image||n.image}}if(!o.me.username)try{let n=window.Spicetify.Platform?.LocalStorageAPI?.namespace;typeof n=="string"&&n.trim()&&(o.me.username=n.trim().toLowerCase().slice(0,60))}catch(n){b("me namespace",n)}(o.me.name||o.me.image)&&io(o.me);let r=!!(o.me.name&&o.me.image);return o.me.name||(o.me.name="Auditeur"),Wt(),ao(),await Ur(),r}function ao(){if(!o.joined)return;let t=o.members.find(e=>e.id===o.peerId);t&&(t.name=o.me.name,t.image=o.me.image),o.role==="host"?(O({t:"profile",name:o.me.name,image:o.me.image}),B()):o.hostConn&&_(o.hostConn,{t:"profile",name:o.me.name,image:o.me.image}),g()}function co(){try{window.Spicetify.Player.addEventListener("songchange",()=>Pr(!0))}catch(t){b("player event songchange",t)}try{window.Spicetify.Player.addEventListener("playpause",()=>Pr(!1))}catch(t){b("player event playpause",t)}}function lo(){Zt(),x()&&H()&&Date.now()-o.lastPush>fn&&M()}(async function(){if(!await Dn(()=>window.Spicetify&&window.Spicetify.Player&&(window.Spicetify.Playbar||window.Spicetify.Topbar)))return;Wn(),Xn(),ro(),no(),await Ir()||window.setTimeout(()=>{Ir()},5e3),o.duo=yn(),o.autoJoin=gn(),b("duo",o.duo?`${o.duo.code} \xB7 ${o.duo.partnerUser?o.duo.partnerName||o.duo.partnerUser:"invitation en attente"}`:"aucun"),!o.duo&&G()&&Nr(G(),!0),o.stats=[],g(),co(),window.setInterval(lo,pn),o.duo&&J(),window.setInterval(()=>{o.duo&&!o.joined&&!o.connectingDuo&&J()},8e3),window.addEventListener("beforeunload",()=>{o.joined&&qt(!0)}),b("pr\xEAt")})();})();
