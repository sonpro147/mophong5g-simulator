
/* ===== Thẻ Toàn trình E2E (e2): luồng đầu cuối 3G / 4G / 5G NSA / 5G SA ===== */
const E2T={g3:'3G UMTS',g4:'4G LTE',nsa:'5G NSA',sa:'5G SA'};
const E2TK=['g3','g4','nsa','sa'];
/* nút mạng: tên, vai trò */
const E2N={
 ue:['UE','Điện thoại + USIM/eSIM: đo sóng, chọn cell, chạy NAS và RRC, giữ khoá bảo mật.'],
 nb:['NodeB','Trạm 3G: điều chế WCDMA, điều khiển công suất vòng trong 1500 lần/giây, lập lịch HSDPA/HSUPA. Không có RRC; RRC nằm ở RNC.'],
 nb2:['NodeB đích','NodeB lân cận dùng khi chuyển giao mềm hoặc đổi cell phục vụ HSDPA.'],
 rnc:['RNC','Bộ điều khiển vô tuyến 3G: RRC, quản lý tài nguyên mã, chuyển giao mềm, mã hoá và toàn vẹn (UEA/UIA kết thúc ở RNC), kết hợp macro-diversity.'],
 msc:['MSC/VLR','Tổng đài miền CS (MSC Server + MGW): điều khiển cuộc gọi CC, quản lý di động MM, VLR lưu dữ liệu thuê bao đang ở vùng. Ở 4G dùng cho CSFB (SGs), SMS qua SGs và SRVCC (Sv).'],
 sgsn:['SGSN','Nút miền gói 3G: GMM/SM, attach, RAU, PDP context, tạo CDR S-CDR. Ở 4G là đích chuyển giao liên hệ thống qua S3/S4.'],
 ggsn:['GGSN','Cổng dữ liệu 3G ra Internet (Gi): cấp IP, PCEF thực thi chính sách (Gx), đếm cước (Gy, Ga).'],
 hlr:['HLR/AuC','Cơ sở dữ liệu thuê bao 2G/3G: hồ sơ dịch vụ, vị trí VLR/SGSN; AuC sinh vector xác thực từ K và OPc.'],
 enb:['eNodeB','Trạm 4G: RRC, PDCP, RLC, MAC, PHY, lập lịch mỗi 1 ms, mã hoá AS, chuyển giao X2. Ở NSA là MeNB (nút chính).'],
 enb2:['eNodeB đích','eNodeB lân cận nhận chuyển giao qua X2 hoặc S1.'],
 mme:['MME','Điều khiển 4G: NAS EMM/ESM, xác thực, chọn SGW/PGW, tìm gọi, TAU, chuyển giao S1 và liên hệ thống, SGs tới MSC, N26 tới AMF.'],
 sgw:['SGW','Cổng phục vụ 4G: điểm neo dữ liệu khi chuyển giao giữa eNB, đệm dữ liệu khi UE rỗi và báo MME (Downlink Data Notification).'],
 pgw:['PGW','Cổng PDN 4G: cấp IP, PCEF, ra SGi tới Internet và IMS, mở phiên Gx với PCRF và Gy với OCS.'],
 hss:['HSS','Cơ sở dữ liệu thuê bao 4G và IMS: S6a cho MME, Cx cho CSCF, lưu hồ sơ IMS (iFC), địa chỉ S-CSCF.'],
 pcrf:['PCRF','Điều khiển chính sách 4G: quyết định QCI, ARP, MBR/GBR, gửi PCC rule tới PGW qua Gx, nhận thông tin media từ P-CSCF qua Rx.'],
 ocs:['OCS','Hệ thống tính cước trực tuyến: cấp hạn mức (quota) thời gian thực qua Gy/Ro hoặc CAP, chặn hoặc chuyển hướng khi hết tiền.'],
 cg:['CGF/BD','Thu thập CDR (Charging Gateway) và hệ thống tính cước sau (billing domain) qua Ga/Gz/Bx.'],
 pcscf:['P-CSCF','Điểm vào IMS: proxy SIP đầu tiên của UE, IPsec với UE, gửi thông tin media sang PCRF/PCF để mở bearer/QoS flow thoại; thường kèm IMS-AGW (ATCF/ATGW).'],
 scscf:['S-CSCF','Lõi điều khiển phiên IMS: đăng ký, xác thực IMS-AKA, tải iFC từ HSS, định tuyến SIP tới AS và mạng đích. I-CSCF được gộp trong hình.'],
 tas:['TAS (MMTel AS)','Máy chủ ứng dụng thoại: dịch vụ bổ sung (chuyển tiếp, chờ, chặn), SCC AS cho SRVCC, tạo cước Ro/Nchf.'],
 pstn:['Mạng đích','Phía đầu kia: IMS của mạng khác, tổng đài PSTN qua MGCF/MGW, hoặc thuê bao cùng mạng.'],
 smsc:['SMSC','Trung tâm tin nhắn: lưu và chuyển tiếp SMS, hỏi HLR/HSS/UDM vị trí người nhận (SRI-SM), gửi báo cáo trạng thái.'],
 inet:['Internet / DN','Mạng dữ liệu ngoài: máy chủ DNS, web, ứng dụng OTT.'],
 ipx:['GRX / IPX','Mạng trung chuyển quốc tế giữa nhà mạng: GTP (Gp/S8/N9), Diameter qua DEA/DRA, SS7 qua STP quốc tế.'],
 gnb:['gNodeB','Trạm 5G NR (CU + DU + RU): RRC, SDAP, PDCP, RLC, MAC, PHY, búp sóng SSB/CSI-RS. Ở NSA là en-gNB (nút phụ, SgNB), không có RRC riêng với UE.'],
 gnb2:['gNodeB đích','gNB lân cận nhận chuyển giao qua Xn (SA) hoặc làm nút phụ mới (NSA).'],
 amf:['AMF','Điều khiển truy nhập và di động 5G: NAS 5GMM, đăng ký, tìm gọi, chuyển giao, chọn SMF, đầu cuối N1/N2, N26 tới MME.'],
 smf:['SMF','Quản lý phiên PDU: cấp IP, chọn UPF, điều khiển UPF qua PFCP (N4), nhận PCC rule từ PCF (N7), mở phiên cước với CHF (N40). Ở liên mạng 4G đóng vai PGW-C.'],
 upf:['UPF','Mặt phẳng người dùng 5G: định tuyến GTP-U N3/N9, ra N6, phân loại QoS flow (QFI), đếm lưu lượng URR, đệm khi UE rỗi. Ở liên mạng 4G đóng vai PGW-U.'],
 ausf:['AUSF','Máy chủ xác thực 5G: chạy 5G-AKA hoặc EAP-AKA′, kiểm RES*, sinh KSEAF.'],
 udm:['UDM/UDR','Dữ liệu thuê bao 5G: hồ sơ truy nhập, NSSAI được phép, SIDF giải mã SUCI → SUPI, ARPF sinh vector xác thực.'],
 pcf:['PCF','Chính sách 5G: AM policy (N15), SM policy (N7), UE policy URSP; nhận thông tin media từ P-CSCF qua N5/Rx.'],
 chf:['CHF','Hàm cước hội tụ 5G: online + offline trong một giao diện Nchf (N40), tạo CDR, quản lý hạn mức và spending limit (N28).'],
 nssf:['NSSF','Chọn lát cắt mạng: từ NSSAI UE yêu cầu trả về Allowed NSSAI và tập AMF phù hợp.'],
 nrf:['NRF','Kho đăng ký NF: các NF tìm nhau (discovery) và đăng ký trạng thái trên kiến trúc dịch vụ SBA.'],
 smsf:['SMSF','Chức năng SMS qua NAS 5G: nhận SMS từ AMF (N20), giao tiếp SMSC bằng MAP/Diameter.'],
 sepv:['vSEPP','SEPP mạng khách: bảo vệ báo hiệu SBI giữa hai nhà mạng (N32, TLS + PRINS/JWE).'],
 seph:['hSEPP','SEPP mạng nhà: lọc, kiểm tra và chuyển tiếp yêu cầu từ mạng khách vào AUSF/UDM/SMF nhà.'],
 smfh:['H-SMF','SMF mạng nhà trong roaming home-routed: cấp IP, áp chính sách và cước của mạng nhà.'],
 upfh:['H-UPF','UPF mạng nhà: điểm ra Internet của thuê bao roaming home-routed (N9 từ V-UPF).']
};
/* vị trí nút trên sơ đồ 1000×440 theo từng công nghệ; o:1 = chỉ hiện khi kịch bản dùng tới */
const E2P={
 g3:{ue:[60,220],nb:[185,220],nb2:[185,330,1],rnc:[315,220],msc:[460,95],sgsn:[460,300],hlr:[615,95],ggsn:[615,300],pcrf:[770,225],ocs:[770,330],smsc:[770,95],pstn:[770,22],inet:[910,300],cg:[615,405,1],ipx:[540,200,1],enb:[185,95,1],mme:[315,95,1],sgw:[460,200,1]},
 g4:{ue:[60,220],enb:[185,220],enb2:[185,320,1],mme:[330,95],sgw:[330,245],hss:[480,40],pgw:[480,245],pcrf:[625,160],ocs:[625,320],pcscf:[765,200],scscf:[895,200],tas:[895,95],inet:[765,320],pstn:[895,320,1],nb:[185,410,1],rnc:[330,410,1],sgsn:[330,330,1],msc:[480,410,1],smsc:[625,410,1],cg:[480,330,1],ipx:[405,170,1]},
 nsa:{ue:[60,220],enb:[185,220],gnb:[185,95],gnb2:[60,95,1],enb2:[185,320,1],mme:[330,95],sgw:[330,245],hss:[480,40],pgw:[480,245],pcrf:[625,160],ocs:[625,320],pcscf:[765,200],scscf:[895,200],tas:[895,95],inet:[765,320],pstn:[895,320,1],nb:[185,410,1],rnc:[330,410,1],msc:[480,410,1],smsc:[625,410,1],cg:[480,330,1],ipx:[405,170,1]},
 sa:{ue:[60,220],gnb:[185,220],gnb2:[185,320,1],amf:[330,95],upf:[330,300],smf:[480,195],ausf:[480,40],udm:[625,40],pcf:[625,140],chf:[625,250],nssf:[330,25,1],nrf:[770,40,1],smsf:[770,120,1],pcscf:[770,220],scscf:[905,220],tas:[905,120],hss:[905,40,1],inet:[770,320],pstn:[905,320,1],smsc:[905,410,1],enb:[185,410,1],mme:[330,410,1],sgw:[480,410,1],cg:[770,410,1],sepv:[405,120,1],seph:[555,120,1],smfh:[625,330,1],upfh:[480,330,1]}
};
/* liên kết: [a,b,giao diện,mặt phẳng c|u|cu] */
const E2L={
 g3:[['ue','nb','Uu','cu'],['ue','nb2','Uu','cu'],['nb','rnc','Iub','cu'],['nb2','rnc','Iub','cu'],['rnc','msc','Iu-CS','cu'],['rnc','sgsn','Iu-PS','cu'],['sgsn','ggsn','Gn','cu'],['sgsn','hlr','Gr','c'],['msc','hlr','D','c'],['ggsn','pcrf','Gx','c'],['ggsn','ocs','Gy','c'],['ggsn','inet','Gi','u'],['msc','pstn','ISUP/BICC','cu'],['msc','smsc','E (MAP)','c'],['smsc','hlr','C (MAP)','c'],['msc','ocs','CAP','c'],['ggsn','cg','Ga','c'],['sgsn','cg','Ga','c'],['ue','enb','Uu','cu'],['enb','mme','S1-MME','c'],['mme','sgsn','S3/Gn','c'],['mme','hlr','S6a','c'],['mme','sgw','S11','c'],['sgw','ggsn','S5','cu'],['enb','sgw','S1-U','u']],
 g4:[['ue','enb','Uu','cu'],['ue','enb2','Uu','cu'],['enb','enb2','X2','cu'],['enb','mme','S1-MME','c'],['enb2','mme','S1-MME','c'],['enb','sgw','S1-U','u'],['enb2','sgw','S1-U','u'],['mme','sgw','S11','c'],['sgw','pgw','S5','cu'],['mme','hss','S6a','c'],['pgw','pcrf','Gx','c'],['pgw','ocs','Gy','c'],['pcrf','ocs','Sy','c'],['pgw','inet','SGi','u'],['pgw','pcscf','SGi (Gm)','u'],['pcscf','pcrf','Rx','c'],['pcscf','scscf','Mw','cu'],['scscf','hss','Cx','c'],['scscf','tas','ISC','cu'],['scscf','pstn','Mw/Mg','cu'],['tas','ocs','Ro','c'],['pcscf','pstn','Mb (RTP)','m'],['mme','msc','SGs/Sv','c'],['ue','nb','Uu','cu'],['nb','rnc','Iub','cu'],['rnc','msc','Iu-CS','cu'],['rnc','sgsn','Iu-PS','cu'],['mme','sgsn','S3','c'],['sgsn','sgw','S4','cu'],['msc','smsc','E (MAP)','c'],['smsc','hss','C/S6c','c'],['msc','scscf','I2','cu'],['msc','pstn','ISUP','cu'],['pgw','cg','Gz','c'],['sgw','cg','Gz','c']],
 sa:[['ue','gnb','Uu','cu'],['ue','gnb2','Uu','cu'],['gnb','gnb2','Xn','cu'],['gnb','amf','N2','c'],['gnb2','amf','N2','c'],['gnb','upf','N3','u'],['gnb2','upf','N3','u'],['amf','smf','N11','c'],['smf','upf','N4','c'],['upf','inet','N6','u'],['amf','ausf','N12','c'],['ausf','udm','N13','c'],['amf','udm','N8','c'],['smf','udm','N10','c'],['amf','pcf','N15','c'],['smf','pcf','N7','c'],['smf','chf','N40','c'],['pcf','chf','N28','c'],['amf','nssf','N22','c'],['amf','nrf','Nnrf','c'],['amf','smsf','N20','c'],['smsf','udm','N21','c'],['smsf','smsc','MAP/SGd','c'],['smsc','udm','C/S6c','c'],['upf','pcscf','N6 (Gm)','u'],['pcscf','pcf','N5/Rx','c'],['pcscf','scscf','Mw','cu'],['scscf','tas','ISC','cu'],['scscf','hss','Cx','c'],['scscf','pstn','Mw/Mg','cu'],['pcscf','pstn','Mb (RTP)','m'],['tas','chf','Ro/Nchf','c'],['ue','enb','Uu','cu'],['enb','mme','S1-MME','c'],['mme','amf','N26','c'],['enb','sgw','S1-U','u'],['mme','sgw','S11','c'],['sgw','smf','S5-C','c'],['sgw','upf','S5-U','u'],['smf','cg','Bx','c'],['chf','cg','Bx','c']]
};
E2L.nsa=E2L.g4.concat([['ue','gnb','Uu (NR)','cu'],['enb','gnb','X2-C/X2-U','cu'],['gnb','sgw','S1-U','u'],['ue','gnb2','Uu (NR)','cu'],['enb','gnb2','X2-C/X2-U','cu'],['gnb2','sgw','S1-U','u'],['gnb','gnb2','X2','cu']]);
/* các đoạn lặp lại: kết nối RRC theo công nghệ */
const e2R3=(c,n)=>[
 'ue>rnc|RRC CONNECTION REQUEST|Uu (PRACH → RACH/CCCH)|UE dò công suất preamble trên PRACH, chờ AICH xác nhận rồi gửi bản tin trên RACH. Nguyên nhân thiết lập: '+c+'.|Establishment cause, Initial UE identity (TMSI/P-TMSI/IMSI)|T300, N300',
 'rnc>nb|NBAP RADIO LINK SETUP REQUEST|Iub (NBAP)|RNC quyết định đưa UE vào CELL_DCH, cấp mã scrambling/channelisation và dựng radio link trên NodeB. Nếu tải nhẹ RNC có thể giữ UE ở CELL_FACH, không cần bước này.|UL scrambling code, DL channelisation code, TFCS',
 'nb>rnc|RADIO LINK SETUP RESPONSE|Iub (NBAP)|NodeB xác nhận, dựng đường truyền Iub (AAL2 hoặc IP/UDP) cho kênh DCH.|Transport bearer binding ID',
 'rnc>ue|RRC CONNECTION SETUP|Uu (FACH)|RNC gán U-RNTI, cấu hình SRB1–SRB3 và trạng thái RRC '+(n||'CELL_DCH')+'.|U-RNTI, RRC state indicator, SRB/TrCH/PhyCH config',
 'ue>rnc|RRC CONNECTION SETUP COMPLETE|Uu (DCCH)|UE báo khả năng vô tuyến (băng, HSDPA/HSUPA category, hỗ trợ E-UTRA).|UE radio access capability, START values'];
const e2R4=(c,nas)=>[
 'ue>enb|Random Access Preamble (Msg1)|Uu (PRACH)|UE chọn ngẫu nhiên một trong 64 preamble, phát với công suất tăng dần (power ramping) tới khi được đáp.|preamble index, RA-RNTI|ra-ResponseWindowSize, preambleTransMax',
 'enb>ue|Random Access Response (Msg2)|Uu (PDSCH)|eNB đo trễ để chỉnh thời gian phát (Timing Advance), cấp grant đường lên và C-RNTI tạm.|TA, UL grant, Temporary C-RNTI',
 'ue>enb|RRCConnectionRequest (Msg3)|Uu (SRB0, CCCH)|Gửi định danh và lý do kết nối: '+c+'.|ue-Identity (S-TMSI hoặc số ngẫu nhiên), establishmentCause|T300',
 'enb>ue|RRCConnectionSetup (Msg4)|Uu (SRB0)|Giải tranh chấp (contention resolution), cấp SRB1 và cấu hình lớp vật lý riêng.|radioResourceConfigDedicated (SRB1, MAC, PHY)',
 'ue>enb|RRCConnectionSetupComplete + '+nas+'|Uu (SRB1)|Bản tin NAS đi kèm trong dedicatedInfoNAS, eNB chưa đọc được nội dung NAS.|selectedPLMN-Identity, registeredMME, dedicatedInfoNAS'];
const e2R5=(c,nas,tm)=>[
 'ue>gnb|Random Access Preamble (Msg1)|Uu NR (PRACH)|UE chọn preamble gắn với búp SSB tốt nhất, nhờ vậy gNB biết hướng búp để đáp lại.|preamble, SSB index ↔ RO, RA-RNTI|ra-ResponseWindow, preambleTransMax',
 'gnb>ue|Random Access Response (Msg2)|Uu NR (PDSCH)|Timing Advance, grant đường lên, TC-RNTI.|TA command, UL grant, TC-RNTI',
 'ue>gnb|RRCSetupRequest (Msg3)|Uu NR (SRB0)|Lý do kết nối: '+c+'.|ue-Identity (ng-5G-S-TMSI-Part1 hoặc ngẫu nhiên), establishmentCause|T300',
 'gnb>ue|RRCSetup (Msg4)|Uu NR (SRB0)|Giải tranh chấp, cấp SRB1, cấu hình cellGroupConfig (BWP ban đầu, CORESET, PUCCH).|radioBearerConfig, masterCellGroup',
 'ue>gnb|RRCSetupComplete + '+nas+'|Uu NR (SRB1)|NAS đi kèm trong dedicatedNAS-Message; gNB chọn AMF theo GUAMI hoặc NSSAI.|selectedPLMN-Identity, registeredAMF, s-NSSAI-List, dedicatedNAS-Message|'+(tm||'')];
/* ===== Kịch bản ===== */
const E2S=[];
/* A1 — Bật máy và đăng ký */
E2S.push({id:'reg',g:'Bật máy → đăng ký → dữ liệu',n:'Bật máy, chọn mạng và đăng ký',
d:'Từ lúc bật máy tới khi mạng biết UE ở đâu, đã xác thực và có khoá bảo mật. 4G gộp luôn bearer mặc định vào attach; 5G SA tách phiên PDU ra bước sau.',
f:{
g3:['#Tìm mạng và chọn cell',
 'ue>ue|Quét tần số, đo CPICH, đọc MIB/SIB|Uu (P-CCPCH/BCH)|UE quét các UARFCN, đồng bộ P-SCH/S-SCH, đo CPICH RSCP và Ec/No, đọc MIB rồi SIB1, SIB3, SIB5, SIB7, SIB11 lấy PLMN, LAC/RAC, ngưỡng chọn cell. Cell phải thoả tiêu chí S (Srxlev > 0, Squal > 0).|PLMN, LAC, RAC, Qqualmin, Qrxlevmin, danh sách lân cận',
 '#Kết nối RRC',...e2R3('registration'),
 '#Đăng ký miền gói (GPRS Attach)',
 'ue>sgsn|ATTACH REQUEST|NAS GMM (RRC Initial Direct Transfer → RANAP Initial UE Message trên Iu-PS)|RNC mở kết nối SCCP tới SGSN và chuyển bản tin NAS nguyên vẹn. Attach type: GPRS attach hoặc combined (khi có Gs).|Attach type, P-TMSI hoặc IMSI, old RAI, MS network capability, DRX parameter|T3310',
 'sgsn>hlr|MAP SEND AUTHENTICATION INFO|Gr (MAP trên SS7 hoặc SIGTRAN)|SGSN xin vector xác thực UMTS từ AuC.|IMSI, số vector yêu cầu',
 'hlr>sgsn|SEND AUTHENTICATION INFO ACK|Gr (MAP)|AuC tính từ khoá K và OPc: bộ năm RAND, XRES, CK, IK, AUTN.|Quintuplets (RAND, XRES, CK, IK, AUTN)',
 '#Xác thực và bảo mật',
 'sgsn>ue|AUTHENTICATION AND CIPHERING REQUEST|NAS GMM|USIM kiểm AUTN (MAC và SQN) để xác thực mạng; đây là điểm 3G hơn 2G: xác thực hai chiều.|RAND, AUTN, CKSN|T3360',
 'ue>sgsn|AUTHENTICATION AND CIPHERING RESPONSE|NAS GMM|USIM trả RES; SGSN so với XRES. Sai SQN → UE trả AUTS để đồng bộ lại.|RES (hoặc AUTS khi lỗi đồng bộ)',
 'sgsn>rnc|RANAP SECURITY MODE COMMAND|Iu-PS (RANAP)|Ở 3G mã hoá và toàn vẹn kết thúc ở RNC, nên SGSN chuyển CK, IK xuống RNC.|CK, IK, danh sách UEA/UIA cho phép (UEA1 KASUMI, UEA2 SNOW 3G)',
 'rnc>ue|RRC SECURITY MODE COMMAND|Uu (DCCH)|RNC chọn thuật toán và bật toàn vẹn ngay; mã hoá bắt đầu từ thời điểm activation time.|Integrity protection mode info, ciphering mode info',
 'ue>rnc|SECURITY MODE COMPLETE|Uu (DCCH)|Bản tin đầu tiên có bảo vệ toàn vẹn.|UL integrity info',
 'rnc>sgsn|RANAP SECURITY MODE COMPLETE|Iu-PS (RANAP)|Báo thuật toán đã chọn.|Chosen integrity/encryption algorithm',
 '#Cập nhật vị trí ở HLR',
 'sgsn>hlr|MAP UPDATE GPRS LOCATION|Gr (MAP)|Báo HLR thuê bao đang được SGSN này phục vụ; HLR huỷ bản ghi ở SGSN cũ (Cancel Location).|IMSI, SGSN number, SGSN address',
 'hlr>sgsn|MAP INSERT SUBSCRIBER DATA|Gr (MAP)|Tải hồ sơ dịch vụ gói.|MSISDN, PDP context profile (APN, QoS), ODB, CAMEL GPRS',
 'sgsn>hlr|INSERT SUBSCRIBER DATA ACK + UPDATE GPRS LOCATION ACK|Gr (MAP)|Hoàn tất cập nhật vị trí.|',
 '#Hoàn tất đăng ký',
 'sgsn>ue|ATTACH ACCEPT|NAS GMM|Cấp P-TMSI mới để không phải gửi IMSI lần sau.|P-TMSI, RAI, Periodic RA update timer|T3312',
 'ue>sgsn|ATTACH COMPLETE|NAS GMM|Xác nhận đã nhận P-TMSI.|',
 'ue>msc|LOCATION UPDATING REQUEST (IMSI attach)|NAS MM (Iu-CS)|Đăng ký miền CS để nhận cuộc gọi và SMS. Khi có giao diện Gs, SGSN làm thay qua combined attach.|LAI cũ, TMSI hoặc IMSI, Location updating type|T3210',
 'msc>hlr|MAP UPDATE LOCATION / INSERT SUBSCRIBER DATA|D (MAP)|VLR lấy vector, xác thực (lặp lại như trên ở miền CS), rồi cập nhật vị trí ở HLR.|IMSI, VLR number, MSC number',
 'msc>ue|LOCATION UPDATING ACCEPT|NAS MM|Cấp TMSI.|TMSI, LAI|T3212',
 '#Về trạng thái rỗi',
 'sgsn>rnc|RANAP IU RELEASE COMMAND|Iu-PS (RANAP)|Không còn báo hiệu, lõi giải phóng kết nối Iu.|Cause: Successful',
 'rnc>ue|RRC CONNECTION RELEASE|Uu (DCCH)|UE về Idle (hoặc CELL_PCH/URA_PCH nếu còn kết nối PS) và nghe tìm gọi theo chu kỳ DRX.|Release cause|T308'],
g4:n=>['#Tìm mạng và chọn cell',
 'ue>ue|Đồng bộ PSS/SSS, đọc MIB, SIB1, SIB2|Uu (PBCH, PDSCH)|UE tìm PCI (504 giá trị) từ PSS/SSS, đo RSRP/RSRQ trên CRS, đọc MIB (băng thông, SFN) rồi SIB1 (PLMN, TAC, q-RxLevMin) và SIB2 (RACH, công suất). Chọn cell theo tiêu chí S.'+(n?' Cell neo NSA phát upperLayerIndication-r15 trong SIB2 để điện thoại hiện biểu tượng 5G.':'')+'|PCI, PLMN, TAC, q-RxLevMin'+(n?', upperLayerIndication-r15':''),
 '#Kết nối RRC',...e2R4('mo-Signalling','ATTACH REQUEST + PDN CONNECTIVITY REQUEST'),
 '#Đăng ký (Attach)',
 'enb>mme|S1AP INITIAL UE MESSAGE (Attach Request)|S1-MME (S1AP/SCTP)|eNB chọn MME (theo GUMMEI hoặc cân bằng tải trong MME pool) và chuyển NAS.|eNB-UE-S1AP-ID, TAI, ECGI, RRC establishment cause|T3410 (ở UE)',
 'mme>hss|Authentication-Information-Request (AIR)|S6a (Diameter)|Xin vector xác thực EPS.|IMSI, Visited-PLMN-Id, số vector',
 'hss>mme|Authentication-Information-Answer (AIA)|S6a (Diameter)|HSS/AuC sinh vector EPS; khoá KASME gắn với ID mạng phục vụ.|RAND, XRES, AUTN, KASME',
 '#Xác thực và bảo mật',
 'mme>ue|AUTHENTICATION REQUEST|NAS EMM|EPS-AKA: UE kiểm AUTN, tính RES và KASME.|RAND, AUTN, NAS KSI|T3460',
 'ue>mme|AUTHENTICATION RESPONSE|NAS EMM|MME so RES với XRES.|RES',
 'mme>ue|SECURITY MODE COMMAND (NAS)|NAS EMM|Bật mã hoá và toàn vẹn NAS; MME gửi lại khả năng bảo mật UE đã khai để chống tấn công hạ cấp (bidding down).|Selected EEA/EIA (thường 128-EEA2/EIA2 AES), replayed UE security capabilities, IMEISV request|T3460',
 'ue>mme|SECURITY MODE COMPLETE (NAS)|NAS EMM|NAS từ đây có mã hoá. MME có thể kiểm IMEI với EIR qua S13.|IMEISV',
 '#Cập nhật vị trí ở HSS',
 'mme>hss|Update-Location-Request (ULR)|S6a (Diameter)|Đăng ký MME phục vụ; HSS gửi Cancel-Location tới MME cũ nếu có.|IMSI, RAT-Type, ULR-Flags',
 'hss>mme|Update-Location-Answer (ULA)|S6a (Diameter)|Tải hồ sơ: APN được phép, QoS mặc định, AMBR'+(n?', Access-Restriction-Data (bit NR as Secondary RAT không bị cấm thì mới được EN-DC)':'')+'.|APN-Configuration, QCI, ARP, APN-AMBR, UE-AMBR'+(n?', Access-Restriction-Data':''),
 '#Lập bearer mặc định',
 'mme>sgw|Create Session Request|S11 (GTPv2-C)|MME chọn SGW, PGW (qua DNS theo APN) và yêu cầu tạo bearer mặc định.|IMSI, APN, RAT type, PDN type, Bearer QoS (QCI 9 hoặc 8, ARP), S5 F-TEID',
 'sgw>pgw|Create Session Request|S5 (GTPv2-C)|SGW tạo TEID đường S5 và chuyển tiếp.|SGW S5 F-TEID',
 'pgw>pcrf|CCR-Initial|Gx (Diameter)|Mở phiên chính sách IP-CAN.|IMSI, UE IP, RAT-Type, APN, QoS mặc định',
 'pcrf>pgw|CCA-Initial|Gx (Diameter)|PCRF trả PCC rule và QoS mặc định theo gói cước.|Charging-Rule-Install, Default-EPS-Bearer-QoS, APN-AMBR',
 'pgw>sgw|Create Session Response|S5 (GTPv2-C)|PGW cấp IP cho UE; với APN ims gửi kèm địa chỉ P-CSCF trong PCO.|PDN Address Allocation, PGW F-TEID, PCO (DNS, P-CSCF)',
 'sgw>mme|Create Session Response|S11 (GTPv2-C)|Trả TEID S1-U của SGW.|SGW S1-U F-TEID',
 'mme>enb|S1AP INITIAL CONTEXT SETUP REQUEST (Attach Accept + Activate Default EPS Bearer Context Request)|S1-MME (S1AP)|Một bản tin vừa dựng ngữ cảnh UE ở eNB vừa mang NAS chấp nhận attach.|E-RAB ID, QCI, SGW TEID, KeNB, UE-AMBR, UE security capabilities; NAS: GUTI, TAI list, T3412',
 '#Bảo mật AS và cấu hình vô tuyến',
 'enb>ue|UECapabilityEnquiry|Uu (SRB1)|eNB hỏi khả năng UE nếu MME chưa có.|rat-Type eutra'+(n?', eutra-nr':''),
 'ue>enb|UECapabilityInformation|Uu (SRB1)|Báo băng tần, tổ hợp CA, MIMO'+(n?', tổ hợp EN-DC (băng LTE + băng NR) để eNB biết có thể thêm nút phụ NR.':'.')+'|supportedBandCombination'+(n?', EN-DC band combinations':''),
 'enb>ue|SecurityModeCommand (AS)|Uu (SRB1)|Bật toàn vẹn và mã hoá RRC/UP; khoá KRRCint, KRRCenc, KUPenc sinh từ KeNB.|cipheringAlgorithm, integrityProtAlgorithm',
 'ue>enb|SecurityModeComplete|Uu (SRB1)|',
 'enb>ue|RRCConnectionReconfiguration (Attach Accept)|Uu (SRB1)|Dựng SRB2 và DRB cho bearer mặc định, cấu hình đo lường.|drb-ToAddModList, measConfig, dedicatedInfoNAS',
 'ue>enb|RRCConnectionReconfigurationComplete|Uu (SRB1)|',
 'enb>mme|INITIAL CONTEXT SETUP RESPONSE|S1-MME (S1AP)|Trả TEID S1-U của eNB.|E-RAB setup list, eNB F-TEID',
 '#Hoàn tất đăng ký',
 'ue>mme|ATTACH COMPLETE (Activate Default EPS Bearer Context Accept)|NAS EMM/ESM (UL Information Transfer → Uplink NAS Transport)|UE xác nhận GUTI và bearer mặc định.|',
 'mme>sgw|Modify Bearer Request|S11 (GTPv2-C)|Báo TEID của eNB để mở đường xuống. Từ đây UE có IP và dùng được dữ liệu.|eNB S1-U F-TEID',
 'sgw>mme|Modify Bearer Response|S11 (GTPv2-C)|Sau attach, điện thoại có VoLTE sẽ mở thêm PDN ims (QCI 5) và đăng ký IMS (xem kịch bản cuộc gọi đi).|'],
sa:['#Tìm mạng và chọn cell',
 'ue>ue|Dò SSB, đọc MIB và SIB1|Uu NR (SSB, PDSCH)|UE dò raster đồng bộ GSCN, tìm PCI (1008 giá trị) từ PSS/SSS, đo SS-RSRP từng búp SSB, đọc MIB (SCS, CORESET#0) rồi SIB1 (PLMN, TAC, cấu hình RACH). Chọn cell theo tiêu chí S.|PCI, SSB index, PLMN, TAC, q-RxLevMin',
 '#Kết nối RRC',...e2R5('mo-Signalling','REGISTRATION REQUEST','T3510 (ở UE)'),
 '#Chọn AMF và đăng ký',
 'gnb>amf|NGAP INITIAL UE MESSAGE (Registration Request)|N2 (NGAP/SCTP)|gNB chọn AMF trong AMF set, chuyển NAS. Lần đầu UE gửi SUCI: SUPI đã mã hoá bằng khoá công khai của nhà mạng, nên IMSI không lộ trên không gian.|RAN UE NGAP ID, User Location (NR CGI, TAI), RRC cause; NAS: registration type initial, SUCI, Requested NSSAI, UE security capability',
 'amf>nssf|Nnssf_NSSelection_Get|N22 (SBI HTTP/2)|Nếu AMF không phục vụ hết lát cắt UE xin, hỏi NSSF để có Allowed NSSAI và AMF phù hợp (có thể chuyển sang AMF khác).|Requested NSSAI, Subscribed S-NSSAI, TAI',
 'amf>ausf|Nausf_UEAuthentication_Authenticate (SUCI)|N12 (SBI HTTP/2)|AMF (SEAF) yêu cầu xác thực.|SUCI, serving network name',
 'ausf>udm|Nudm_UEAuthentication_Get|N13 (SBI HTTP/2)|UDM (SIDF) giải mã SUCI → SUPI, ARPF chọn 5G-AKA hay EAP-AKA′ và sinh vector.|SUCI, serving network name',
 'udm>ausf|Response: 5G HE AV|N13|Vector nhà: RAND, AUTN, XRES*, KAUSF, kèm SUPI.|RAND, AUTN, XRES*, KAUSF, SUPI',
 'ausf>amf|Response: 5G SE AV|N12|AUSF giữ XRES*, chỉ đưa HXRES* (băm) cho mạng phục vụ — mạng khách không tự quyết xác thực thay mạng nhà.|RAND, AUTN, HXRES*',
 '#Xác thực và bảo mật',
 'amf>ue|AUTHENTICATION REQUEST|NAS 5GMM|UE kiểm AUTN, tính RES*.|RAND, AUTN, ngKSI, ABBA|T3560',
 'ue>amf|AUTHENTICATION RESPONSE|NAS 5GMM|AMF so băm của RES* với HXRES*.|RES*',
 'amf>ausf|Nausf_UEAuthentication_Authenticate (RES*)|N12|AUSF xác nhận RES* = XRES*, trả KSEAF và SUPI cho AMF.|RES*',
 'ausf>amf|Response: kết quả + KSEAF + SUPI|N12|Từ KSEAF, AMF sinh KAMF rồi KgNB.|Authentication result, SUPI, KSEAF',
 'amf>ue|SECURITY MODE COMMAND (NAS)|NAS 5GMM|Chọn thuật toán NAS, phát lại khả năng bảo mật UE.|NEA/NIA (thường 128-NEA2/NIA2), replayed UE security capabilities, IMEISV request|T3560',
 'ue>amf|SECURITY MODE COMPLETE (NAS)|NAS 5GMM|Gửi lại toàn bộ Registration Request trong NAS container đã mã hoá (các IE nhạy cảm không gửi rõ lúc đầu).|PEI (IMEISV), NAS message container',
 '#Lấy dữ liệu thuê bao và chính sách',
 'amf>udm|Nudm_UECM_Registration|N8 (SBI)|AMF đăng ký là AMF phục vụ UE.|SUPI, AMF ID, RAT type',
 'amf>udm|Nudm_SDM_Get + Subscribe|N8 (SBI)|Tải dữ liệu truy nhập và di động, dữ liệu chọn SMF; đăng ký nhận thông báo khi hồ sơ đổi.|Subscribed NSSAI, UE-AMBR, RAT restriction, DNN',
 'amf>pcf|Npcf_AMPolicyControl_Create|N15 (SBI)|Lấy chính sách truy nhập: RFSP (ưu tiên tần số), vùng phục vụ; PCF có thể đẩy URSP xuống UE.|SUPI, TAI, RAT type',
 'pcf>amf|AM Policy Response|N15|',
 '#Ngữ cảnh vô tuyến và hoàn tất',
 'amf>gnb|NGAP INITIAL CONTEXT SETUP REQUEST (Registration Accept)|N2 (NGAP)|Dựng ngữ cảnh UE ở gNB, kèm NAS chấp nhận đăng ký. Chưa có phiên PDU nếu UE chưa xin.|KgNB, UE security capability, Allowed NSSAI; NAS: 5G-GUTI, TAI list, Allowed NSSAI, T3512',
 'gnb>ue|UECapabilityEnquiry / UECapabilityInformation|Uu NR (SRB1)|Hỏi và nhận khả năng: băng NR, tổ hợp CA, MIMO, hỗ trợ VoNR, EN-DC/NR-DC.|rat-Type nr, eutra-nr',
 'gnb>ue|SecurityModeCommand (AS)|Uu NR (SRB1)|Bật bảo mật AS bằng khoá từ KgNB.|cipheringAlgorithm, integrityProtAlgorithm',
 'ue>gnb|SecurityModeComplete|Uu NR (SRB1)|',
 'gnb>ue|RRCReconfiguration (Registration Accept)|Uu NR (SRB1)|Dựng SRB2, cấu hình đo lường.|measConfig, radioBearerConfig, dedicatedNAS-MessageList',
 'ue>gnb|RRCReconfigurationComplete|Uu NR (SRB1)|',
 'gnb>amf|INITIAL CONTEXT SETUP RESPONSE|N2 (NGAP)|',
 'ue>amf|REGISTRATION COMPLETE|NAS 5GMM|Xác nhận 5G-GUTI. Khác 4G: đăng ký 5G không tự tạo phiên dữ liệu; UE phải xin phiên PDU riêng (kịch bản tiếp theo). Không dùng thì gNB có thể đưa UE vào RRC_INACTIVE.|']},
kpi:{g3:['RRC Setup Success Rate (registration)','Attach Success Rate (GMM)','Location Update Success Rate','Authentication failure ratio'],g4:['RRC Setup Success Rate','Attach Success Rate','Authentication Success Rate','Initial E-RAB Setup Success Rate'],sa:['RRC Setup Success Rate','Registration Success Rate (initial)','Authentication Success Rate','Initial Context Setup Success Rate']},
err:[['RRC Setup thất bại','Thiếu tài nguyên, nhiễu đường lên cao, PRACH sai cấu hình, cell quá tải','Thống kê RRC Setup fail theo cause; RSSI/IoT đường lên; cấu hình preamble, root sequence'],['Xác thực thất bại (Synch failure)','SQN ở USIM lệch AuC (AUTS)','Trace NAS: Authentication Failure cause #21 hoặc #21 Synch failure; HSS log'],['Attach Reject cause #7/#8, Registration Reject #7','Thuê bao không được phép dịch vụ gói/5GS','Hồ sơ HLR/HSS/UDM: APN, Access-Restriction-Data, RAT restriction'],['Attach Reject #15 / #13','Không có cell phù hợp trong TA / roaming không cho phép','Danh sách TA cho phép, thoả thuận roaming, hạn chế vùng'],['Không có biểu tượng 5G (NSA)','Cell neo không phát upperLayerIndication, hoặc HSS cấm NR as Secondary RAT','SIB2; ULA Access-Restriction-Data; UE capability EN-DC']],
tab:[['radio','Phủ sóng và chọn cell'],['sig','Báo hiệu và lưu lượng'],['pr','Giao thức NAS/RRC'],['core','Mạng lõi'],['kpi','KPI truy nhập']],
ref:{g3:'TS 25.331 (RRC), 24.008 (MM/GMM), 25.413 (RANAP), 33.102 (bảo mật 3G)',g4:'TS 36.331, 24.301 (EMM/ESM), 36.413 (S1AP), 23.401 mục 5.3.2, 33.401',nsa:'TS 37.340 (EN-DC), 36.331 r15, 23.401, 29.272 (Access-Restriction-Data)',sa:'TS 38.331, 24.501 (5GMM), 38.413 (NGAP), 23.502 mục 4.2.2.2, 33.501 (5G-AKA, SUCI)'},
t:{g3:'1–3 s (attach PS + cập nhật vị trí CS)',g4:'0,3–1 s',nsa:'0,3–1 s (giống 4G)',sa:'0,2–0,8 s'}});

/* A2 — Phiên dữ liệu và truy cập Internet */
E2S.push({id:'data',g:'Bật máy → đăng ký → dữ liệu',n:'Lập phiên dữ liệu và vào Internet',
d:'Từ lúc mở ứng dụng tới khi gói tin đầu tiên tới máy chủ. 3G mở PDP context, 4G nối lại bearer mặc định đã có từ attach, NSA thêm nút phụ NR để tăng tốc, 5G SA mở phiên PDU.',
f:{
g3:['#Kết nối RRC',...e2R3('originatingInteractiveCall'),
 '#Lập PDP context',
 'ue>sgsn|SERVICE REQUEST (signalling) → ACTIVATE PDP CONTEXT REQUEST|NAS GMM/SM (Iu-PS)|UE xin ngữ cảnh dữ liệu cho APN (ví dụ m-wap, internet).|NSAPI, APN, requested QoS (traffic class, MBR), PDP type IPv4/IPv6/IPv4v6, PCO|T3380',
 'sgsn>sgsn|Phân giải APN bằng DNS nội bộ (Gn DNS)|DNS|SGSN tìm địa chỉ GGSN theo APN (APN.mnc.mcc.gprs).|APN-NI, APN-OI',
 'sgsn>ggsn|GTPv1-C CREATE PDP CONTEXT REQUEST|Gn (GTPv1-C/UDP 2123)|Mở đường hầm GTP giữa SGSN và GGSN.|IMSI, MSISDN, APN, QoS profile, TEID-C, TEID-U, RAT type, charging characteristics',
 'ggsn>pcrf|CCR-Initial|Gx (Diameter)|Nếu có PCC: xin chính sách cho phiên.|IMSI, UE IP, APN',
 'pcrf>ggsn|CCA-Initial|Gx|PCC rule, QoS tối đa theo gói cước.|Charging-Rule-Install, QoS-Information',
 'ggsn>sgsn|CREATE PDP CONTEXT RESPONSE|Gn (GTPv1-C)|GGSN cấp IP (pool nội bộ hoặc RADIUS).|PDP address, GGSN TEIDs, negotiated QoS, Charging ID',
 '#Thiết lập kênh mang vô tuyến (RAB)',
 'sgsn>rnc|RANAP RAB ASSIGNMENT REQUEST|Iu-PS (RANAP)|Yêu cầu RNC dựng RAB với QoS đã thoả thuận. Có Direct Tunnel thì đưa luôn TEID của GGSN để dữ liệu đi thẳng RNC–GGSN.|RAB ID, RAB parameters (traffic class, MBR), Iu-PS transport address, TEID',
 'rnc>nb|NBAP RADIO LINK RECONFIGURATION (HS-DSCH, E-DCH)|Iub (NBAP)|Cấp tài nguyên HSDPA (HS-DSCH, HS-SCCH, HS-DPCCH) và HSUPA (E-DCH).|HS-DSCH MAC-d flow, E-DCH MAC-d flow',
 'rnc>ue|RADIO BEARER SETUP|Uu (DCCH)|Ánh xạ RB vào HS-DSCH/E-DCH, UE vào CELL_DCH.|RB info, TrCH info, HS-DSCH info, E-DCH info',
 'ue>rnc|RADIO BEARER SETUP COMPLETE|Uu (DCCH)|',
 'rnc>sgsn|RAB ASSIGNMENT RESPONSE|Iu-PS (RANAP)|Trả TEID phía RNC.|RAB setup list, RNC TEID',
 'sgsn>ue|ACTIVATE PDP CONTEXT ACCEPT|NAS SM|UE nhận IP, DNS.|PDP address, negotiated QoS, PCO (DNS)',
 '#Truyền dữ liệu',
 'ue>inet|DNS query → TCP SYN → TLS ClientHello|Uu → Iub → Iu-PS (GTP-U) → Gn (GTP-U) → Gi|Gói IP của UE được đóng trong GTP-U trên Iu-PS và Gn, ra Gi ở GGSN (thường qua NAT/firewall).|TEID trên Iu-PS và Gn||u',
 'inet>ue|Dữ liệu đường xuống|Gi → Gn → Iu-PS → Iub (HS-DSCH) → Uu|NodeB lập lịch HSDPA mỗi TTI 2 ms theo CQI, HARQ tại NodeB; MAC-hs/ehs.|CQI, HARQ process||u',
 '#Hết hoạt động',
 'rnc>ue|RRC: CELL_DCH → CELL_FACH → CELL_PCH/URA_PCH|Uu (DCCH)|Hết lưu lượng, RNC hạ trạng thái theo bộ đếm không hoạt động để tiết kiệm pin và mã; PDP context vẫn giữ, IP không đổi.|Inactivity timer (theo vendor)'],
g4:n=>['#Kết nối lại từ rỗi (Service Request)',...e2R4('mo-Data','SERVICE REQUEST'),
 'enb>mme|S1AP INITIAL UE MESSAGE (Service Request)|S1-MME|MME kiểm toàn vẹn NAS; thường không cần xác thực lại.|S-TMSI, TAI, ECGI',
 'mme>enb|INITIAL CONTEXT SETUP REQUEST|S1-MME (S1AP)|Đưa lại toàn bộ bearer đang có (bearer mặc định đã tạo từ attach).|E-RAB list (QCI 9), SGW TEID, KeNB, UE-AMBR',
 'enb>ue|SecurityModeCommand (AS)|Uu (SRB1)|',
 'ue>enb|SecurityModeComplete|Uu (SRB1)|',
 'enb>ue|RRCConnectionReconfiguration (DRB)|Uu (SRB1)|Dựng DRB, cấu hình DRX kết nối, đo lường'+(n?' và B1-NR để tìm cell 5G.':'.')+'|drb-ToAddModList, measConfig'+(n?' (B1-NR, b1-ThresholdNR)':''),
 'ue>enb|RRCConnectionReconfigurationComplete|Uu (SRB1)|',
 'enb>mme|INITIAL CONTEXT SETUP RESPONSE|S1-MME|',
 'mme>sgw|Modify Bearer Request|S11 (GTPv2-C)|Báo TEID eNB, SGW mở đường xuống.|eNB F-TEID',
 'sgw>mme|Modify Bearer Response|S11|',
 ...(n?['#Thêm nút phụ NR (SgNB Addition)',
 'ue>enb|MeasurementReport (B1-NR)|Uu (SRB1)|Có cell NR mạnh hơn ngưỡng B1.|measId, NR PCI, SS-RSRP',
 'enb>gnb|X2AP SgNB ADDITION REQUEST|X2-C (X2AP)|MeNB chọn kiểu bearer (thường SCG split bearer: PDCP ở gNB).|E-RAB, kiểu bearer, UE capability (CG-ConfigInfo), S-KgNB, kết quả đo NR',
 'gnb>enb|SgNB ADDITION REQUEST ACKNOWLEDGE|X2-C|gNB chấp nhận, gửi cấu hình NR và TEID.|CG-Config (cấu hình NR RRC), gNB X2-U/S1-U F-TEID',
 'enb>ue|RRCConnectionReconfiguration (nr-Config-r15)|Uu LTE (SRB1)|RRC NR được bọc trong RRC LTE: UE chỉ có một RRC với MeNB.|nr-Config-r15, nr-RadioBearerConfig1-r15, sk-Counter',
 'ue>enb|RRCConnectionReconfigurationComplete|Uu LTE|',
 'enb>gnb|SgNB RECONFIGURATION COMPLETE|X2-C|',
 'ue>gnb|Random Access trên PSCell NR|Uu NR (PRACH)|UE đồng bộ với cell NR (thường không tranh chấp). Lỗi bước này → SCG failure.|preamble riêng|T304 (SCG)',
 'enb>mme|E-RAB MODIFICATION INDICATION|S1-MME|Option 3x: đổi đường S1-U về gNB.|E-RAB, gNB S1-U F-TEID',
 'mme>sgw|Modify Bearer Request|S11|SGW chuyển đường xuống sang gNB; gửi End Marker trên đường cũ.|',
 'mme>enb|E-RAB MODIFICATION CONFIRM|S1-MME|']:[]),
 '#Truyền dữ liệu',
 n?'ue>inet|DNS → TCP/QUIC → HTTPS|Uu NR + Uu LTE → gNB (PDCP chia luồng) → S1-U → S5 → SGi|PDCP ở gNB chia gói ra hai chân NR và LTE (qua X2-U); đường lên thường đi chân NR khi đủ tốt (ul-DataSplitThreshold).|primaryPath, ul-DataSplitThreshold||u|ue,gnb,sgw,pgw,inet':'ue>inet|DNS → TCP/QUIC → HTTPS|Uu → S1-U (GTP-U) → S5 (GTP-U) → SGi|Gói IP đóng GTP-U trên S1-U và S5, ra SGi ở PGW.|TEID S1-U, TEID S5||u',
 n?'inet>ue|Dữ liệu đường xuống (EN-DC)|SGi → S5 → S1-U → gNB → Uu NR và X2-U → eNB → Uu LTE|Tốc độ = tổng chân NR và LTE. gNB lập lịch theo slot (0,5 ms với SCS 30 kHz).|CQI NR/LTE, rank, MCS||u|inet,pgw,sgw,gnb,ue':'inet>ue|Dữ liệu đường xuống|SGi → S5 → S1-U → Uu|eNB lập lịch mỗi 1 ms theo CQI/RI/PMI, HARQ 8 tiến trình, ghép sóng mang CA.|CQI, RI, PMI, MCS||u',
 '#Hết hoạt động',
 'enb>mme|UE CONTEXT RELEASE REQUEST (user inactivity)|S1-MME|Hết bộ đếm không hoạt động (thường 10–20 s), eNB xin giải phóng; bearer mặc định vẫn còn ở lõi, UE về rỗi.'+(n?' SgNB được giải phóng trước.':'')+'|Cause: User Inactivity'],
sa:['#Yêu cầu phiên PDU',
 'ue>amf|UL NAS TRANSPORT (PDU SESSION ESTABLISHMENT REQUEST)|NAS 5GMM/5GSM (Uu NR → N2)|UE xin phiên PDU cho DNN internet trên một lát cắt.|PDU session ID, S-NSSAI, DNN, Request type initial, PDU session type IPv4v6, SSC mode|T3580',
 'amf>nrf|Nnrf_NFDiscovery (tìm SMF)|Nnrf (SBI)|AMF tìm SMF phục vụ DNN + S-NSSAI (có thể cấu hình sẵn).|target NF type SMF, DNN, S-NSSAI',
 'amf>smf|Nsmf_PDUSession_CreateSMContext Request|N11 (SBI)|Chuyển yêu cầu 5GSM cho SMF.|SUPI, DNN, S-NSSAI, PDU session ID, N1 SM container, User location',
 'smf>udm|Nudm_SDM_Get (SM subscription)|N10 (SBI)|Lấy 5QI mặc định, Session-AMBR, SSC mode được phép.|SUPI, DNN, S-NSSAI',
 'smf>amf|CreateSMContext Response|N11|',
 'smf>pcf|Npcf_SMPolicyControl_Create|N7 (SBI)|Xin chính sách phiên.|SUPI, DNN, S-NSSAI, IP, RAT type',
 'pcf>smf|SM Policy Response|N7|PCC rule, 5QI mặc định (thường 9), Session-AMBR.|PCC rules, default QoS, Session-AMBR',
 'smf>chf|Nchf_ConvergedCharging_Create|N40 (SBI)|Mở phiên cước hội tụ (online + offline).|SUPI, PDU session info, rating group',
 '#Chọn UPF và mở đường dữ liệu',
 'smf>upf|PFCP SESSION ESTABLISHMENT REQUEST|N4 (PFCP/UDP 8805)|SMF chọn UPF, cấp IP UE, cài luật xử lý gói.|PDR (nhận dạng), FAR (chuyển tiếp), QER (QoS), URR (đếm cước), CN tunnel info',
 'upf>smf|PFCP SESSION ESTABLISHMENT RESPONSE|N4|Trả TEID N3 của UPF.|UPF N3 F-TEID',
 'smf>amf|Namf_Communication_N1N2MessageTransfer|N11 (SBI)|Gửi hai phần: N2 cho gNB (QoS, TEID) và N1 cho UE (chấp nhận).|N2 SM: QFI, QoS profile, UPF TEID; N1 SM: PDU Session Establishment Accept (IP, QoS rules, Session-AMBR)',
 '#Cấu hình vô tuyến',
 'amf>gnb|NGAP PDU SESSION RESOURCE SETUP REQUEST|N2 (NGAP)|gNB ánh xạ QoS flow vào DRB (SDAP).|PDU session ID, QoS flow list, UL NG-U TEID, NAS PDU',
 'gnb>ue|RRCReconfiguration (DRB + PDU Session Establishment Accept)|Uu NR (SRB1)|Dựng DRB, cấu hình SDAP (QFI → DRB), PDCP, RLC, BWP.|drb-ToAddModList, sdap-Config, dedicatedNAS-MessageList',
 'ue>gnb|RRCReconfigurationComplete|Uu NR|',
 'gnb>amf|PDU SESSION RESOURCE SETUP RESPONSE|N2|Trả TEID của gNB.|DL NG-U TEID',
 'amf>smf|Nsmf_PDUSession_UpdateSMContext|N11|',
 'smf>upf|PFCP SESSION MODIFICATION REQUEST|N4|Báo TEID gNB để mở đường xuống.|FAR cập nhật (outer header gNB TEID)',
 'upf>smf|PFCP SESSION MODIFICATION RESPONSE|N4|',
 '#Truyền dữ liệu',
 'ue>inet|DNS → TCP/QUIC → HTTPS|Uu NR (SDAP/PDCP) → N3 (GTP-U, QFI) → N6|Header GTP-U trên N3 mang QFI; UPF áp QER (Session-AMBR) và đếm URR.|QFI, TEID N3||u',
 'inet>ue|Dữ liệu đường xuống|N6 → N3 → Uu NR|gNB lập lịch theo slot, MIMO nhiều lớp, búp sóng theo CSI-RS.|CQI, RI, PMI, MCS||u',
 '#Hết hoạt động',
 'gnb>ue|RRCRelease (suspendConfig) → RRC_INACTIVE|Uu NR|Hết hoạt động, gNB đưa UE vào INACTIVE: giữ ngữ cảnh ở gNB và lõi, lần sau nối lại bằng RRCResume nhanh hơn.|suspendConfig (I-RNTI, ran-PagingCycle, RNA)']},
kpi:{g3:['PDP Context Activation Success Rate','PS RAB Setup Success Rate','HSDPA throughput','PS Drop Rate'],g4:['Service Request Success Rate','E-RAB Setup Success Rate','DL/UL User Throughput','E-RAB Drop Rate','Latency'],nsa:['SgNB Addition Success Rate','SgNB Abnormal Release Rate','EN-DC Throughput','Thời gian ở EN-DC'],sa:['PDU Session Establishment Success Rate','DRB Setup Success Rate','DL/UL User Throughput','QoS Flow Drop Rate']},
err:[['PDP/PDN/PDU reject cause #27 / #33','APN/DNN sai hoặc không có trong hồ sơ','APN cấu hình trên máy; hồ sơ HLR/HSS/UDM'],['Có IP nhưng không vào được web','DNS lỗi, firewall/NAT Gi/SGi/N6, MTU lớn bị phân mảnh','Trace DNS, kiểm MTU (GTP thêm 36–40 byte), luật firewall'],['SgNB Addition thất bại','Thiếu X2, ngưỡng B1 sai, tổ hợp EN-DC không hỗ trợ','X2 status, b1-ThresholdNR, UE capability'],['Tốc độ thấp dù sóng tốt','Tải cao, AMBR/QoS giới hạn, truyền dẫn nghẽn','PRB utilization, AMBR trong ULA/PCC, đo backhaul']],
tab:[['core','Mạng lõi: bearer, QoS'],['prb','Cấp phát PRB'],['frame','Khung và lưới tài nguyên'],['tx','Truyền dẫn'],['kpi','KPI']],
ref:{g3:'TS 24.008 (SM), 25.413, 29.060 (GTPv1)',g4:'TS 23.401 mục 5.3.4, 29.274 (GTPv2), 29.212 (Gx)',nsa:'TS 37.340 mục 10.2, 36.423 (X2AP)',sa:'TS 23.502 mục 4.3.2, 29.244 (PFCP), 29.502, 38.413'},
t:{g3:'1,5–3 s (từ Idle tới có dữ liệu)',g4:'50–100 ms (Service Request)',nsa:'thêm 100–300 ms cho SgNB Addition',sa:'0,1–0,3 s; từ INACTIVE nối lại < 50 ms'}});
/* B — Thoại */
const e2ImsReg=(sa)=>['#Đăng ký IMS (một lần sau khi có PDN/phiên PDU ims)',
 'ue>pcscf|SIP REGISTER|Gm (SIP qua '+(sa?'phiên PDU DNN ims, 5QI 5':'bearer mặc định APN ims, QCI 5')+')|UE lấy địa chỉ P-CSCF từ PCO, gửi REGISTER chưa có xác thực.|From/To IMPU (sip:+84…@ims.mnc…), Contact, Security-Client (IPsec)||s',
 'pcscf>scscf|REGISTER (qua I-CSCF)|Mw (SIP)|I-CSCF hỏi HSS (UAR/UAA) để chọn S-CSCF rồi chuyển tiếp.|Path, P-Visited-Network-ID||s',
 'scscf>hss|Cx MAR (Multimedia-Auth-Request)|Cx (Diameter)|S-CSCF xin vector IMS-AKA.|IMPI, IMPU, SIP-Auth-Data-Item',
 'scscf>ue|401 Unauthorized|Mw → Gm (SIP)|Thách thức xác thực; P-CSCF giữ CK/IK để lập IPsec SA với UE.|WWW-Authenticate: nonce (RAND+AUTN), Security-Server||s',
 'ue>scscf|REGISTER (có RES)|Gm → Mw (SIP, trên IPsec)|ISIM tính RES; từ đây SIP giữa UE và P-CSCF đi trong IPsec.|Authorization: response||s',
 'scscf>hss|Cx SAR (Server-Assignment-Request)|Cx (Diameter)|Lưu S-CSCF phục vụ, tải hồ sơ dịch vụ và iFC.|Server-Assignment-Type REGISTRATION, User-Data (iFC)',
 'scscf>ue|200 OK (REGISTER)|Mw → Gm (SIP)|Đăng ký xong; UE có thể gọi và nhận cuộc gọi qua IMS.|P-Associated-URI, Service-Route, Expires||s',
 'scscf>tas|REGISTER bên thứ ba|ISC (SIP)|Theo iFC, báo TAS (MMTel AS) để kích hoạt dịch vụ bổ sung.|||s'];
E2S.push({id:'mo',g:'Cuộc gọi thoại',n:'Cuộc gọi đi',
d:'Thuê bao bấm gọi tới khi hai bên nói chuyện và gác máy. 3G dùng tổng đài CS (MSC), 4G dùng VoLTE qua IMS với bearer QCI 1, 5G SA dùng VoNR với QoS flow 5QI 1. NSA giữ thoại trên chân LTE.',
f:{
g3:['#Kết nối RRC',...e2R3('originatingConversationalCall'),
 '#Yêu cầu dịch vụ CS',
 'ue>msc|CM SERVICE REQUEST|NAS MM (RANAP Initial UE Message trên Iu-CS)|Xin dịch vụ cuộc gọi đi.|CM service type: MO call, TMSI, CKSN, Classmark 2/3|T3230',
 'msc>rnc|RANAP SECURITY MODE COMMAND|Iu-CS (RANAP)|MSC có thể xác thực lại (tuỳ chính sách) rồi bật mã hoá ở RNC.|CK, IK, UEA/UIA',
 'rnc>ue|SECURITY MODE COMMAND / COMPLETE|Uu (DCCH)|Bật toàn vẹn và mã hoá miền CS.|',
 '#Thiết lập cuộc gọi',
 'ue>msc|CC SETUP|NAS CC|Gửi số bị gọi và khả năng mang (thoại, danh sách codec AMR/AMR-WB).|Called party BCD number, Bearer capability, Supported codec list|T303',
 'msc>ue|CALL PROCEEDING|NAS CC|MSC nhận cuộc gọi, bắt đầu định tuyến.|',
 'msc>rnc|RANAP RAB ASSIGNMENT REQUEST|Iu-CS (RANAP)|RAB thoại conversational, Iu-UP mode support, địa chỉ MGW.|RAB parameters (AMR 12.2 kbps, 3 sub-flow), Transport address MGW',
 'rnc>ue|RADIO BEARER SETUP (DCH thoại)|Uu (DCCH)|Dựng RB AMR trên DCH, TTI 20 ms; công suất điều khiển nhanh.|RB mapping, TFCS AMR',
 'ue>rnc|RADIO BEARER SETUP COMPLETE|Uu|',
 'rnc>msc|RAB ASSIGNMENT RESPONSE|Iu-CS|',
 'msc>pstn|ISUP IAM / BICC / SIP-I INVITE|Nb + ISUP/BICC|MSC (sau khi hỏi HLR nếu gọi di động) định tuyến tới tổng đài đích.|Called/Calling number, codec list (TrFO)',
 'pstn>msc|ACM (Address Complete)|ISUP|Đích đang đổ chuông.|',
 'msc>ue|ALERTING|NAS CC|UE nghe hồi âm chuông (ringback).|',
 'pstn>msc|ANM (Answer)|ISUP|Bị gọi nhấc máy, bắt đầu tính cước.|',
 'msc>ue|CONNECT|NAS CC||',
 'ue>msc|CONNECT ACKNOWLEDGE|NAS CC||',
 '#Đàm thoại',
 'ue>pstn|Khung thoại AMR 20 ms|Uu (DCH) → Iub → Iu-CS (Iu-UP) → MGW → TDM/IP|Kênh mạch dành riêng suốt cuộc gọi; chuyển giao mềm giữ cuộc gọi khi di chuyển.|AMR mode, SID (DTX khi im lặng)||u',
 '#Kết thúc',
 'ue>msc|DISCONNECT|NAS CC|Gác máy.|Cause #16 Normal call clearing|T305',
 'msc>ue|RELEASE / RELEASE COMPLETE|NAS CC||',
 'msc>rnc|RANAP IU RELEASE COMMAND|Iu-CS||',
 'rnc>ue|RRC CONNECTION RELEASE|Uu|UE về Idle.|'],
g4:n=>[...e2ImsReg(0),
 '#Gửi INVITE',
 'ue>pcscf|SIP INVITE (SDP offer)|Gm (SIP, bearer QCI 5)|UE đang kết nối (nếu rỗi thì Service Request trước). SDP chào codec AMR-WB/EVS và precondition QoS.|Request-URI tel:+84…, SDP (m=audio, AMR-WB, EVS), Supported: precondition, 100rel||s',
 'pcscf>scscf|INVITE|Mw|P-CSCF kiểm danh tính (P-Asserted-Identity).|||s',
 'scscf>tas|INVITE|ISC|Theo iFC, TAS xử lý dịch vụ bổ sung (CLIR, chặn gọi…) rồi trả lại.|||s',
 'scscf>pstn|INVITE (tới mạng hoặc IMS bị gọi)|Mw / Mg (MGCF nếu ra PSTN)|S-CSCF tra ENUM/DNS hoặc chuyển BGCF→MGCF.|||s',
 'pstn>ue|100 Trying → 183 Session Progress (SDP answer)|Mw → Gm|Bên kia chọn codec; hai bên thương lượng precondition.|SDP answer, chosen codec||s',
 '#Lập bearer thoại QCI 1',
 'pcscf>pcrf|Rx AAR (thông tin media)|Rx (Diameter)|P-CSCF gửi codec, băng thông, cổng RTP để PCRF lập chính sách.|Media-Component-Description (audio, bandwidth), AF-Application-Identifier',
 'pcrf>pgw|Gx RAR (PCC rule QCI 1)|Gx|PCRF ra lệnh tạo bearer riêng GBR.|Charging-Rule-Install: QCI 1, ARP, GBR/MBR UL/DL',
 'pgw>sgw|Create Bearer Request|S5 (GTPv2-C)|Tạo bearer dành riêng; TFT lọc đúng luồng RTP.|EPS Bearer QoS QCI 1, TFT, PGW TEID',
 'sgw>mme|Create Bearer Request|S11|',
 'mme>enb|E-RAB SETUP REQUEST|S1-MME (S1AP)|Kèm NAS Activate Dedicated EPS Bearer Context Request.|E-RAB ID, QCI 1, GBR, ARP, SGW TEID',
 'enb>ue|RRCConnectionReconfiguration (DRB QCI 1)|Uu (SRB1)|DRB thoại: RLC UM, ROHC nén header RTP/UDP/IP, DRX, có thể TTI bundling và SPS.|drb-ToAddModList (RLC-UM), pdcp-Config (rohc), sps-Config',
 'ue>enb|RRCConnectionReconfigurationComplete|Uu|',
 'enb>mme|E-RAB SETUP RESPONSE|S1-MME|',
 'mme>sgw|Create Bearer Response|S11 → S5|Bearer QCI 1 sẵn sàng; PCRF báo P-CSCF qua Rx.|',
 '#Đổ chuông và trả lời',
 'ue>pcscf|PRACK, UPDATE (precondition đã đủ)|Gm|Báo tài nguyên phía mình đã có.|||s',
 'pstn>ue|180 Ringing|Mw → Gm|UE phát hồi âm chuông.|||s',
 'pstn>ue|200 OK (INVITE)|Mw → Gm|Bị gọi nhấc máy.|||s',
 'ue>pstn|ACK|Gm → Mw|||s',
 '#Đàm thoại',
 'ue>pstn|RTP/RTCP thoại (AMR-WB/EVS 20 ms)|Uu (DRB QCI 1) → S1-U → S5 → SGi → IMS-AGW|Gói RTP ~ 30–60 byte sau ROHC; mục tiêu trễ đầu cuối < 150 ms, mất gói < 1 %.|QCI 1 (PDB 100 ms, PELR 10⁻²)||u|ue,enb,sgw,pgw,pcscf,pstn',
 '#Kết thúc',
 'ue>pstn|BYE / 200 OK|Gm → Mw|||s',
 'pcscf>pcrf|Rx STR (kết thúc phiên media)|Rx||',
 'pcrf>pgw|Gx RAR (xoá rule QCI 1)|Gx||',
 'pgw>mme|Delete Bearer Request|S5 → S11|',
 'mme>enb|E-RAB RELEASE COMMAND|S1-MME|Xoá DRB QCI 1; bearer QCI 5 (SIP) và QCI 9 (dữ liệu) vẫn giữ.|',
 ...(n?['#Ghi chú NSA','enb>enb|Thoại ở NSA ở lại trên LTE|Uu LTE|Bearer QCI 1 cấu hình ở MCG (eNB), không chia sang NR. Nhiều mạng còn tạm giải phóng SgNB khi gọi để tránh lỗi SCG làm rớt thoại.|']:[])],
sa:[...e2ImsReg(1),
 '#Gửi INVITE',
 'ue>pcscf|SIP INVITE (SDP offer)|Gm (SIP, QoS flow 5QI 5)|Như VoLTE; SDP chào EVS/AMR-WB.|Request-URI, SDP, precondition||s',
 'pcscf>scscf|INVITE|Mw|||s',
 'scscf>tas|INVITE|ISC|||s',
 'scscf>pstn|INVITE (tới mạng bị gọi)|Mw / Mg|||s',
 'pstn>ue|183 Session Progress (SDP answer)|Mw → Gm|||s',
 '#Lập QoS flow thoại 5QI 1',
 'pcscf>pcf|N5 Npcf_PolicyAuthorization_Create (hoặc Rx AAR)|N5 (SBI) / Rx|P-CSCF gửi thông tin media.|Media components, codec, băng thông',
 'pcf>smf|Npcf_SMPolicyControl_UpdateNotify (PCC rule 5QI 1)|N7|PCF quyết định QoS flow GBR mới.|5QI 1, ARP, GFBR/MFBR, packet filter',
 'smf>upf|PFCP SESSION MODIFICATION (PDR/QER cho QFI mới)|N4|UPF gắn QFI mới cho luồng RTP.|PDR (packet filter RTP), QER (GFBR/MFBR), QFI',
 'smf>amf|Namf_Communication_N1N2MessageTransfer|N11|N2: QoS flow mới cho gNB; N1: PDU SESSION MODIFICATION COMMAND cho UE.|QFI, QoS profile, QoS rules',
 'amf>gnb|NGAP PDU SESSION RESOURCE MODIFY REQUEST|N2|gNB quyết định: cấp DRB VoNR, hoặc từ chối để EPS fallback (xem kịch bản thoại dự phòng).|QoS flow add list, NAS PDU',
 'gnb>ue|RRCReconfiguration (DRB cho 5QI 1)|Uu NR|DRB thoại: RLC UM, ROHC, PDCP 12 bit, cấu hình C-DRX ngắn, có thể cấu hình grant cố định.|drb-ToAddModList, sdap-Config (QFI 1 → DRB)',
 'ue>gnb|RRCReconfigurationComplete|Uu NR|',
 'gnb>amf|PDU SESSION RESOURCE MODIFY RESPONSE|N2|',
 'ue>smf|PDU SESSION MODIFICATION COMPLETE|NAS 5GSM (qua AMF)|',
 '#Đổ chuông và trả lời',
 'ue>pcscf|PRACK / UPDATE|Gm|||s',
 'pstn>ue|180 Ringing → 200 OK|Mw → Gm|||s',
 'ue>pstn|ACK|Gm|||s',
 '#Đàm thoại',
 'ue>pstn|RTP/RTCP (EVS/AMR-WB)|Uu NR (DRB 5QI 1) → N3 → UPF → N6 → IMS-AGW|5QI 1: PDB 100 ms, PER 10⁻². Có thể bật ANBR (codec rate adaptation) để giảm bitrate khi sóng yếu.|QFI 1||u|ue,gnb,upf,pcscf,pstn',
 '#Kết thúc',
 'ue>pstn|BYE / 200 OK|Gm → Mw|||s',
 'pcf>smf|Xoá PCC rule 5QI 1|N7 → N4 → N2|SMF xoá QFI ở UPF và gNB; phiên ims (5QI 5) vẫn giữ.|']},
kpi:{g3:['CS Call Setup Success Rate (RRC + RAB)','CS Drop Call Rate','Call setup time','Soft HO overhead'],g4:['VoLTE Call Setup Success Rate (E-RAB QCI 1)','VoLTE Drop Rate','IMS Registration Success Rate','SIP INVITE→180 time','MOS, mất gói RTP'],sa:['VoNR Call Setup Success Rate (QoS flow 5QI 1)','VoNR Drop Rate','IMS Registration Success Rate','Call setup time','MOS']},
err:[['IMS REGISTER 403/404','Hồ sơ IMS (IMPU/IMPI) thiếu trong HSS, sai APN ims','HSS: IMS subscription; UE: APN ims, cấu hình P-CSCF'],['E-RAB/QoS flow thoại không lập được','PCRF/PCF không nhận Rx/N5, ARP thấp bị từ chối, gNB không hỗ trợ VoNR','Trace Rx AAR/RAR; Gx RAR; E-RAB setup fail cause'],['Cuộc gọi đổ chuông chậm','Paging bên bị gọi lâu, precondition chờ, chuyển hướng qua nhiều AS','Đo INVITE→180 theo từng chặng'],['Rớt cuộc gọi khi đang nói','RLF do sóng yếu, chuyển giao lỗi, RTP timeout','RLF report, HO fail, RTP inactivity timer ở IMS'],['Tiếng lúc mất lúc có','Mất gói, jitter lớn do truyền dẫn hoặc lập lịch','Đo RTP loss/jitter, cấu hình DRX, ROHC']],
tab:[['ims','IMS'],['vo','VoLTE: tham số và trace'],['sv','Dịch vụ 4G/5G'],['sig','Báo hiệu'],['kpi','KPI thoại']],
ref:{g3:'TS 24.008 (CC), 23.108, 25.413',g4:'TS 23.228 (IMS), 24.229 (SIP), 23.203 (PCC), 29.214 (Rx), GSMA IR.92',nsa:'GSMA IR.92; thoại trên LTE như 4G',sa:'TS 23.502 mục 4.3.3, 23.228, GSMA NG.114 (VoNR)'},
t:{g3:'4–7 s tới khi đổ chuông',g4:'1,5–3 s tới khi đổ chuông',nsa:'1,5–3 s (như VoLTE)',sa:'1–2,5 s tới khi đổ chuông'}});

E2S.push({id:'mt',g:'Cuộc gọi thoại',n:'Cuộc gọi đến khi máy đang rỗi (tìm gọi)',
d:'Mạng phải tìm UE đang rỗi bằng tìm gọi (paging) theo vùng LA/RA, TA hoặc vùng RAN, đánh thức nó rồi mới đưa cuộc gọi tới.',
f:{
g3:['#Định tuyến cuộc gọi đến',
 'pstn>msc|ISUP IAM tới GMSC|ISUP/BICC|Tổng đài cổng (GMSC) nhận cuộc gọi tới số MSISDN.|Called MSISDN',
 'msc>hlr|MAP SEND ROUTING INFORMATION|C (MAP)|GMSC hỏi HLR thuê bao đang ở VLR nào.|MSISDN',
 'hlr>msc|MAP PROVIDE ROAMING NUMBER → SRI ACK (MSRN)|D / C (MAP)|HLR hỏi VLR phục vụ cấp số MSRN tạm, trả về cho GMSC để định tuyến tiếp.|IMSI, MSRN',
 '#Tìm gọi',
 'msc>rnc|RANAP PAGING|Iu-CS (RANAP)|MSC tìm gọi trong cả vùng LA (mọi RNC phục vụ LA đó).|IMSI hoặc TMSI, LAI, Paging cause terminating conversational call',
 'rnc>ue|PAGING TYPE 1|Uu (PICH + PCH)|UE thức dậy theo chu kỳ DRX (thường 1,28 s), thấy chỉ thị trên PICH thì đọc PCH.|Paging record (TMSI), DRX cycle length coefficient',
 ...e2R3('terminatingConversationalCall').slice(0,1),'rnc>ue|RRC CONNECTION SETUP / COMPLETE|Uu|Như cuộc gọi đi.|',
 'ue>msc|PAGING RESPONSE|NAS RR/MM (Iu-CS)|UE đáp tìm gọi.|TMSI, CKSN, Classmark',
 'msc>rnc|SECURITY MODE (CS)|Iu-CS → Uu|Bật mã hoá miền CS.|',
 '#Thiết lập cuộc gọi',
 'msc>ue|CC SETUP|NAS CC|Số chủ gọi, khả năng mang.|Calling party number, Bearer capability',
 'ue>msc|CALL CONFIRMED|NAS CC||',
 'msc>rnc|RAB ASSIGNMENT REQUEST → RADIO BEARER SETUP|Iu-CS → Uu|Dựng kênh thoại AMR.|',
 'ue>msc|ALERTING|NAS CC|Máy đổ chuông; MSC gửi ACM về mạng chủ gọi.|',
 'ue>msc|CONNECT|NAS CC|Người dùng nhấc máy; MSC gửi ANM.|',
 'msc>ue|CONNECT ACKNOWLEDGE|NAS CC||'],
g4:n=>['#INVITE tới mạng',
 'pstn>scscf|SIP INVITE|Mw / Mg|S-CSCF của bị gọi nhận INVITE (qua I-CSCF hỏi HSS LIR/LIA).|||s',
 'scscf>tas|INVITE (dịch vụ phía bị gọi)|ISC|TAS áp chuyển tiếp, chặn gọi đến…|||s',
 'scscf>pcscf|INVITE|Mw|||s',
 'pcscf>sgw|INVITE tới IP của UE|SGi → S5 (bearer QCI 5)|Gói SIP tới SGW; UE đang rỗi nên SGW đệm gói lại.|||s|pcscf,pgw,sgw',
 '#Tìm gọi',
 'sgw>mme|Downlink Data Notification|S11 (GTPv2-C)|SGW báo có dữ liệu cho UE rỗi. Có Paging Policy Differentiation thì báo đây là SIP thoại để MME ưu tiên.|EPS bearer ID (QCI 5), ARP, Paging and Service Information',
 'mme>sgw|Downlink Data Notification Ack|S11|',
 'mme>enb|S1AP PAGING|S1-MME|MME tìm gọi trên các eNB thuộc danh sách TA của UE.|UE Paging Identity (S-TMSI), TAI list, Paging DRX, Paging Priority',
 'enb>ue|Paging|Uu (PDCCH P-RNTI + PCCH)|UE thức ở paging occasion theo DRX (thường 1,28 s).|pagingRecordList (S-TMSI), cn-Domain ps',
 '#Kết nối lại (Service Request)',...e2R4('mt-Access','SERVICE REQUEST'),
 'enb>mme|INITIAL UE MESSAGE (Service Request)|S1-MME|',
 'mme>enb|INITIAL CONTEXT SETUP REQUEST|S1-MME|Khôi phục bearer QCI 5 và QCI 9.|',
 'enb>ue|SecurityModeCommand + RRCConnectionReconfiguration|Uu|',
 'mme>sgw|Modify Bearer Request|S11|SGW xả gói SIP đã đệm.|',
 'sgw>ue|INVITE (từ bộ đệm SGW)|S1-U → Uu|||s',
 '#Bearer thoại, đổ chuông, trả lời',
 'ue>pcscf|183 Session Progress (SDP answer)|Gm|||s',
 'pcscf>pcrf|Rx AAR|Rx|Mở bearer QCI 1 như cuộc gọi đi.|',
 'pcrf>pgw|Gx RAR → Create Bearer QCI 1 → E-RAB SETUP|Gx → S5/S11 → S1|',
 'ue>pstn|180 Ringing|Gm → Mw|||s',
 'ue>pstn|200 OK|Gm → Mw|||s',
 'pstn>ue|ACK, bắt đầu RTP|Mw → Gm|||s'],
sa:['#INVITE tới mạng',
 'pstn>scscf|SIP INVITE|Mw|||s',
 'scscf>pcscf|INVITE|Mw|||s',
 'pcscf>upf|INVITE tới IP của UE|N6|UE rỗi (CM-IDLE): UPF đệm gói (hoặc SMF đệm tuỳ cấu hình).|||s',
 '#Tìm gọi',
 'upf>smf|PFCP SESSION REPORT REQUEST (Downlink Data Report)|N4|UPF báo có dữ liệu đường xuống.|PDR ID, QFI (5QI 5), DSCP cho Paging Policy Differentiation',
 'smf>amf|Namf_Communication_N1N2MessageTransfer|N11|SMF nhờ AMF đánh thức UE.|PDU session ID, N2 SM info, ARP, 5QI, Paging Policy Indicator',
 'amf>gnb|NGAP PAGING|N2|AMF tìm gọi trong TAI list. Nếu UE đang RRC_INACTIVE thì lõi không biết: chính gNB làm RAN paging trong vùng RNA.|5G-S-TMSI, TAI list, Paging DRX, Paging priority',
 'gnb>ue|Paging|Uu NR (PDCCH P-RNTI)|Gửi paging theo từng búp SSB (beam sweeping).|pagingRecordList (ng-5G-S-TMSI)',
 '#Kết nối lại (Service Request)',...e2R5('mt-Access','SERVICE REQUEST'),
 'gnb>amf|INITIAL UE MESSAGE (Service Request)|N2|',
 'amf>smf|Nsmf_PDUSession_UpdateSMContext (kích hoạt UP)|N11|',
 'amf>gnb|INITIAL CONTEXT SETUP REQUEST|N2|Kèm PDU session resource setup cho phiên ims.|',
 'gnb>ue|SecurityModeCommand + RRCReconfiguration|Uu NR|',
 'smf>upf|PFCP SESSION MODIFICATION (TEID gNB)|N4|UPF xả gói đã đệm.|',
 'upf>ue|INVITE (từ bộ đệm UPF)|N3 → Uu NR|||s',
 '#QoS flow thoại, đổ chuông, trả lời',
 'ue>pcscf|183 Session Progress|Gm|||s',
 'pcscf>pcf|N5/Rx → PCC rule 5QI 1|N5 → N7 → N4/N2|Như cuộc gọi đi.|',
 'ue>pstn|180 Ringing → 200 OK|Gm → Mw|||s',
 'pstn>ue|ACK, bắt đầu RTP|Mw → Gm|||s']},
kpi:{g3:['Paging Success Rate (CS)','MT Call Setup Success Rate','Paging load PCH'],g4:['Paging Success Rate (S1)','Service Request Success Rate (mt-Access)','VoLTE MT Call Setup Success Rate','Paging Discard Rate (eNB)'],sa:['Paging Success Rate (NGAP)','RAN Paging Success Rate (INACTIVE)','VoNR MT Call Setup Success Rate']},
err:[['Gọi đến báo “không liên lạc được”','UE không nghe được paging: vùng phủ yếu, TAI list sai, UE kẹt ở cell không phục vụ','Paging success theo TA, cấu hình TAI list, log UE'],['Paging thành công nhưng cuộc gọi không nối','Service Request bị từ chối, lỗi bảo mật, không lập được bearer QCI 1','Trace S1/NGAP, NAS cause'],['Paging quá tải','TA quá lớn, chu kỳ DRX ngắn, nhiều lần lặp','Tải PCH/PO, chia lại TA, paging strategy ở MME/AMF']],
tab:[['mob','Di động và điều hướng'],['ims','IMS'],['sig','Báo hiệu'],['kpi','KPI']],
ref:{g3:'TS 23.018 (định tuyến cuộc gọi), 25.331 mục 8.1.2',g4:'TS 23.401 mục 5.3.4.3, 36.304 (paging occasion)',nsa:'Như 4G: tìm gọi trên LTE',sa:'TS 23.502 mục 4.2.3.3, 38.304, 38.300 (RAN paging)'},
t:{g3:'Paging 0,5–2 s + thiết lập 3–5 s',g4:'Paging 0,3–1,5 s',nsa:'Như 4G',sa:'Paging 0,2–1,3 s; từ INACTIVE nhanh hơn'}});

E2S.push({id:'fb',g:'Cuộc gọi thoại',n:'Thoại dự phòng: CSFB và EPS fallback',
d:'Khi mạng hiện tại không mang được thoại: 4G không có VoLTE thì rơi về 3G để gọi qua MSC (CSFB); 5G SA chưa bật VoNR thì chuyển về 4G để gọi VoLTE (EPS fallback).',
na:{g3:'Không áp dụng: 3G mang thoại trực tiếp trên miền CS (xem kịch bản Cuộc gọi đi).'},
f:{
g4:n=>['#Điều kiện trước',
 'ue>mme|Combined EPS/IMSI Attach (đã làm từ trước)|NAS EMM + SGs|Để dùng CSFB, UE đăng ký kết hợp; MME lập liên kết SGs với MSC/VLR (SGsAP-LOCATION-UPDATE).|Attach type combined, LAI ánh xạ từ TAI',
 '#Yêu cầu CSFB',
 'ue>mme|EXTENDED SERVICE REQUEST|NAS EMM|Bấm gọi → UE báo cần CS fallback (cuộc gọi đến thì MME đã nhận SGsAP-PAGING-REQUEST từ MSC trước đó).|Service type: MO CS fallback, CSFB response',
 'mme>enb|UE CONTEXT MODIFICATION REQUEST|S1-MME (S1AP)|Ra lệnh cho eNB đưa UE sang 3G.|CS Fallback Indicator, Registered LAI',
 ...(n?['enb>gnb|SgNB RELEASE REQUEST|X2-C|NSA: giải phóng nút phụ NR trước khi rời LTE.|']:[]),
 'enb>ue|RRCConnectionReconfiguration (đo UTRA, tuỳ chọn)|Uu|Có thể đo trước để chọn tần số 3G tốt, đổi lại thêm thời gian.|measObjectUTRA',
 '#Rời 4G sang 3G',
 'enb>ue|RRCConnectionRelease (redirectedCarrierInfo UTRA-FDD)|Uu|Cách phổ biến: redirection (kèm SIB 3G nếu có RIM/SI tunnelling để khỏi đọc lại). Cách nhanh hơn: PS handover.|redirectedCarrierInfo (UARFCN), cellInfoList-r9',
 'enb>mme|UE CONTEXT RELEASE REQUEST|S1-MME|MME tạm treo bearer PS nếu 3G không hỗ trợ DTM/PS HO.|Cause: CS Fallback triggered',
 'ue>ue|Chọn cell 3G, đọc SIB|Uu UMTS|Thời gian này cộng vào thời gian thiết lập cuộc gọi.|',
 '#Gọi trên 3G',
 'ue>rnc|RRC CONNECTION REQUEST (originatingConversationalCall)|Uu UMTS|',
 'ue>msc|CM SERVICE REQUEST (có cờ CSMO)|NAS MM (Iu-CS)|Nếu LA của cell 3G khác LA đã đăng ký thì phải Location Update trước.|CSMO flag|T3230',
 'ue>msc|CC SETUP|NAS CC|Phần còn lại như cuộc gọi 3G thường.|',
 'msc>ue|CALL PROCEEDING → ALERTING → CONNECT|NAS CC|',
 'ue>pstn|Đàm thoại AMR|Uu → Iub → Iu-CS → MGW||||u',
 '#Quay lại 4G',
 'msc>ue|DISCONNECT / RELEASE|NAS CC|',
 'rnc>ue|RRC CONNECTION RELEASE (redirection E-UTRA)|Uu UMTS|Fast Return: chỉ thẳng tần số LTE để quay về ngay, không chờ chọn lại cell.|redirectionInfo E-UTRA',
 'ue>mme|TRACKING AREA UPDATE REQUEST|NAS EMM|Về LTE, UE làm TAU; MME nối lại bearer đã treo.|EPS update type'],
sa:['#INVITE và yêu cầu QoS flow thoại',
 'ue>pcscf|SIP INVITE|Gm (5QI 5)|UE đăng ký IMS qua 5G và gọi như VoNR.|||s',
 'pcscf>pcf|N5/Rx (thông tin media)|N5|',
 'pcf>smf|PCC rule 5QI 1|N7|',
 'smf>amf|N1N2MessageTransfer (QoS flow 5QI 1)|N11|',
 'amf>gnb|PDU SESSION RESOURCE MODIFY REQUEST (5QI 1)|N2|',
 '#gNB quyết định EPS fallback',
 'gnb>gnb|Không cho VoNR → kích hoạt EPS fallback|—|gNB (theo cấu hình hoặc khả năng UE) không lập DRB 5QI 1.|',
 'gnb>amf|PDU SESSION RESOURCE MODIFY RESPONSE (từ chối)|N2|Báo lõi đang chuyển về EPS; SMF giữ yêu cầu QoS để làm lại bên 4G.|Cause: IMS voice EPS fallback or RAT fallback triggered',
 'gnb>ue|RRCReconfiguration (đo E-UTRA, B1)|Uu NR|Tuỳ chọn; bỏ đo thì dùng redirection “mù” để nhanh hơn.|measObjectEUTRA',
 'ue>gnb|MeasurementReport|Uu NR|',
 '#Chuyển giao N26 sang 4G',
 'gnb>amf|HANDOVER REQUIRED (đích eNB)|N2|',
 'amf>smf|Nsmf_PDUSession_Context Request|N11|Lấy ngữ cảnh bearer EPS tương ứng (SMF+PGW-C).|EPS bearer contexts',
 'amf>mme|Forward Relocation Request|N26 (GTPv2-C)|Chuyển ngữ cảnh UE từ AMF sang MME.|MM context, PDN connections',
 'mme>sgw|Create Session Request|S11|',
 'mme>enb|S1AP HANDOVER REQUEST|S1-MME|',
 'enb>mme|HANDOVER REQUEST ACKNOWLEDGE|S1-MME|',
 'mme>amf|Forward Relocation Response|N26|',
 'amf>gnb|HANDOVER COMMAND|N2|',
 'gnb>ue|MobilityFromNRCommand (E-UTRA)|Uu NR|',
 'ue>enb|RRCConnectionReconfigurationComplete|Uu LTE|UE đã ở LTE.|',
 'enb>mme|HANDOVER NOTIFY|S1-MME|',
 'mme>sgw|Modify Bearer Request|S11 → S5|SGW nối với SMF+PGW-C.|',
 'ue>mme|TRACKING AREA UPDATE REQUEST|NAS EMM|',
 '#Lập bearer QCI 1 ở 4G và tiếp tục cuộc gọi',
 'pcf>smf|PCC rule QCI 1 (PCF/PCRF hội tụ)|N7/Gx|',
 'smf>sgw|Create Bearer Request (QCI 1)|S5-C|',
 'mme>enb|E-RAB SETUP (QCI 1) → RRCConnectionReconfiguration|S1 → Uu|',
 'ue>pstn|180 Ringing → 200 OK → RTP trên LTE|Gm → Mw|Cuộc gọi tiếp tục như VoLTE. Kết thúc gọi, UE về lại 5G bằng chọn lại cell hoặc redirection.|||s|ue,enb,sgw,upf,pcscf,scscf,pstn']},
note:{nsa:'NSA: giống 4G; nếu đã có VoLTE thì không cần CSFB. Bước giải phóng SgNB được thêm vào.'},
kpi:{g4:['CSFB Success Rate','CSFB Call Setup Time','Fast Return ratio','LAU trong CSFB'],sa:['EPS Fallback Success Rate','Thời gian EPS fallback','N26 HO Success Rate','Return to NR time']},
err:[['CSFB thời gian chờ dài','Redirection mù sang tần số 3G yếu, phải LAU vì LA không khớp TA','Ánh xạ TAI–LAI, RIM/SI tunnelling, đo trước'],['CSFB thất bại, không có sóng 3G','Tần số redirection sai hoặc 3G quá tải','Danh sách UARFCN redirection, tải 3G'],['EPS fallback lâu > 3 s','Có đo B1 trước, thiếu N26 (phải redirection, mất IP)','Cấu hình EPS fallback: HO hay redirection; N26 interface'],['Không quay về 5G sau khi gọi','Thiếu ưu tiên NR trong SIB LTE, không cấu hình fast return','cellReselectionPriority NR, RFSP']],
tab:[['sv','Dịch vụ 4G/5G'],['hx','Chuyển giao'],['mob','Di động và điều hướng'],['vo','VoLTE']],
ref:{g4:'TS 23.272 (CSFB), 29.118 (SGsAP)',nsa:'TS 23.272',sa:'TS 23.502 mục 4.13.6.1 (EPS fallback), 23.501 mục 5.17'},
t:{g4:'Thêm 1–3 s so với gọi 3G thường',nsa:'Như 4G',sa:'Thêm 0,5–1,5 s so với VoNR'}});
E2S.find(s=>s.id==='fb').use={g4:['nb'],nsa:['nb']};
/* C — Di động và chuyển giao */
E2S.push({id:'idle',g:'Di động và chuyển giao',n:'Di chuyển khi rỗi: chọn lại cell và cập nhật vùng',
d:'Máy rỗi tự chọn lại cell, không báo mạng. Chỉ khi sang vùng định vị mới (LA/RA ở 3G, TA ngoài danh sách ở 4G/5G) hoặc hết bộ đếm định kỳ, UE mới báo để mạng còn tìm gọi được.',
f:{
g3:['#Chọn lại cell khi rỗi',
 'ue>ue|Đo CPICH lân cận, xếp hạng theo tiêu chí R|Uu|Cell mới phải tốt hơn cell hiện tại một khoảng Qhyst + Qoffset liên tục trong Treselection. Đo lân cận chỉ khi chất lượng dưới Sintrasearch/Sintersearch để tiết kiệm pin.|Qhyst1s, Qoffset1s,n, Treselections, Sintrasearch',
 'ue>ue|Đọc SIB1 cell mới: LAC/RAC khác|Uu (BCH)|Vùng định vị mới → phải cập nhật.|LAC, RAC',
 '#Cập nhật vùng định tuyến (RAU)',...e2R3('registration','CELL_FACH').slice(0,1),
 'ue>sgsn|ROUTING AREA UPDATE REQUEST|NAS GMM (Iu-PS)|Nếu RAI cũ thuộc SGSN khác, SGSN mới hỏi SGSN cũ ngữ cảnh (SGSN CONTEXT REQUEST trên Gn) rồi cập nhật HLR.|Update type, old RAI, P-TMSI, P-TMSI signature|T3330',
 'sgsn>hlr|MAP UPDATE GPRS LOCATION (khi đổi SGSN)|Gr|HLR huỷ bản ghi ở SGSN cũ.|',
 'sgsn>ue|ROUTING AREA UPDATE ACCEPT|NAS GMM|Có thể cấp P-TMSI mới.|P-TMSI, RAI, T3312',
 'ue>sgsn|ROUTING AREA UPDATE COMPLETE|NAS GMM||',
 '#Cập nhật vùng định vị (LAU)',
 'ue>msc|LOCATION UPDATING REQUEST (normal)|NAS MM (Iu-CS)|Đổi LA thì báo MSC/VLR; đổi MSC thì VLR mới cập nhật HLR.|LAI cũ, TMSI|T3210',
 'msc>hlr|MAP UPDATE LOCATION (khi đổi VLR)|D||',
 'msc>ue|LOCATION UPDATING ACCEPT|NAS MM||TMSI, LAI|T3212',
 'rnc>ue|RRC CONNECTION RELEASE|Uu|',
 '#Cập nhật định kỳ',
 'ue>ue|Hết T3312 / T3212 → RAU / LU định kỳ|NAS|Không đổi vùng nhưng vẫn báo định kỳ để mạng biết máy còn sống; không báo quá hạn thì mạng coi là đã tách (implicit detach).|T3312 (thường 54 phút), T3212 (thường 1–2 giờ)'],
g4:n=>['#Chọn lại cell khi rỗi',
 'ue>ue|Đo RSRP/RSRQ, ưu tiên tần số|Uu|Cùng tần số: xếp hạng R (Qhyst, Qoffset). Khác tần số/khác RAT: theo cellReselectionPriority với threshX-High/Low, threshServingLow.'+(n?' Ở NSA, khi rỗi UE chỉ ở LTE; NR không tham gia chọn cell.':'')+'|cellReselectionPriority, threshX-High, threshServingLow, t-ReselectionEUTRA, s-NonIntraSearch',
 'ue>ue|Đọc SIB1: TAC không thuộc TAI list|Uu|Ra khỏi danh sách TA đã được giao → phải TAU.|TAC',
 '#Cập nhật vùng theo dõi (TAU)',...e2R4('mo-Signalling','TRACKING AREA UPDATE REQUEST'),
 'enb>mme|INITIAL UE MESSAGE (TAU Request)|S1-MME|Nếu GUTI thuộc MME khác, MME mới gửi Context Request (S10) tới MME cũ.|Old GUTI, last visited TAI, EPS bearer context status, active flag',
 'mme>sgw|Modify Bearer Request (hoặc Create Session khi đổi SGW)|S11|',
 'mme>hss|Update-Location-Request (khi đổi MME)|S6a|HSS gửi Cancel-Location tới MME cũ.|',
 'mme>ue|TRACKING AREA UPDATE ACCEPT|NAS EMM|Giao TAI list mới, có thể cấp GUTI mới.|TAI list, GUTI, T3412, EPS bearer context status',
 'ue>mme|TRACKING AREA UPDATE COMPLETE|NAS EMM|Chỉ gửi khi có GUTI mới.|',
 'mme>enb|UE CONTEXT RELEASE COMMAND|S1-MME|UE về rỗi.|',
 '#Cập nhật định kỳ',
 'ue>ue|Hết T3412 → TAU định kỳ|NAS EMM|Mặc định 54 phút. Nếu MME không nhận được trong T3412 + mobile reachable timer, MME coi UE không còn với tới được.|T3412, PSM: T3324']
,sa:['#Chọn lại cell khi rỗi hoặc INACTIVE',
 'ue>ue|Đo SS-RSRP/SS-RSRQ trên SSB, ưu tiên tần số|Uu NR|Giống 4G nhưng đo trên SSB, có SMTC (cửa sổ đo) và số búp gộp (nrofSS-BlocksToAverage).|cellReselectionPriority, threshX-High/Low, SMTC, absThreshSS-BlocksConsolidation',
 'ue>ue|Đọc SIB1: TAC không thuộc TAI list (hoặc ra khỏi RNA khi INACTIVE)|Uu NR|Ra khỏi TAI list → Mobility Registration Update. Đang INACTIVE mà ra khỏi vùng RNA → RNA update ở RAN, lõi không biết.|TAC, RAN area code',
 '#Cập nhật vùng RAN (khi INACTIVE)',
 'ue>gnb|RRCResumeRequest (resumeCause rna-Update)|Uu NR|gNB mới lấy ngữ cảnh từ gNB cũ qua Xn (RETRIEVE UE CONTEXT) rồi trả UE về INACTIVE.|fullI-RNTI, resumeMAC-I|T319',
 'gnb>ue|RRCRelease (suspendConfig mới)|Uu NR||I-RNTI, RNA mới, t380 (định kỳ)',
 '#Cập nhật đăng ký do di chuyển',...e2R5('mo-Signalling','REGISTRATION REQUEST (mobility registration updating)'),
 'gnb>amf|INITIAL UE MESSAGE (Registration Request)|N2|Nếu 5G-GUTI thuộc AMF khác, AMF mới gọi Namf_Communication_UEContextTransfer tới AMF cũ.|Registration type: mobility registration updating, 5G-GUTI, PDU session status',
 'amf>udm|Nudm_UECM_Registration (khi đổi AMF)|N8|',
 'amf>smf|Nsmf_PDUSession_UpdateSMContext|N11|Báo vị trí mới cho các phiên PDU; có thể đổi UPF trung gian.|',
 'amf>ue|REGISTRATION ACCEPT|NAS 5GMM|TAI list mới, có thể 5G-GUTI mới.|TAI list, 5G-GUTI, T3512, Allowed NSSAI',
 'ue>amf|REGISTRATION COMPLETE|NAS 5GMM||',
 '#Cập nhật định kỳ',
 'ue>ue|Hết T3512 → Periodic Registration Update|NAS 5GMM|Mặc định 54 phút.|T3512']},
kpi:{g3:['RAU Success Rate','LU Success Rate','Paging Success Rate'],g4:['TAU Success Rate','Paging Success Rate','Tỷ lệ inter-MME TAU'],sa:['Mobility Registration Update Success Rate','RNA Update Success Rate','Paging Success Rate']},
err:[['Ping-pong chọn lại cell','Qhyst/Treselection quá nhỏ, hai cell mạnh ngang nhau','Thống kê reselection, tham số SIB3/SIB4'],['TAU/RAU nhiều bất thường','Ranh giới TA/LA đi qua đường đông người, TAI list nhỏ','Bản đồ TA, cấu hình TAI list'],['Máy không lên 5G khi rỗi (SA)','Ưu tiên NR trong SIB LTE thấp hơn LTE','cellReselectionPriority NR trong SIB24/SIB5']],
tab:[['radio','Phủ sóng và chọn cell'],['mob','Di động và điều hướng'],['ca','Tham số nâng cao'],['es','Tiết kiệm điện']],
ref:{g3:'TS 25.304 (chọn cell), 24.008',g4:'TS 36.304, 24.301 mục 5.5.3',nsa:'Như 4G',sa:'TS 38.304, 24.501 mục 5.5.1.3, 38.300 (RNA)'},
t:{g3:'RAU/LU 0,5–1,5 s',g4:'TAU 0,1–0,3 s',nsa:'Như 4G',sa:'0,1–0,3 s; RNA update < 0,1 s'}});

E2S.push({id:'ho',g:'Di động và chuyển giao',n:'Chuyển giao cùng công nghệ khi đang kết nối',
d:'Đang có dữ liệu hoặc cuộc gọi mà di chuyển: 3G dùng chuyển giao mềm (nối nhiều NodeB cùng lúc), 4G/5G dùng chuyển giao cứng có chuẩn bị qua X2/Xn, NSA đổi nút phụ NR.',
use:{g3:['nb2'],g4:['enb2'],nsa:['gnb2'],sa:['gnb2']},
f:{
g3:['#Đo và báo cáo',
 'rnc>ue|MEASUREMENT CONTROL|Uu (DCCH)|Cấu hình sự kiện nội tần: 1A (thêm), 1B (bớt), 1C (thay), 1D (đổi cell tốt nhất).|reportingRange 1A/1B, hysteresis, timeToTrigger, CPICH Ec/No',
 'ue>rnc|MEASUREMENT REPORT (event 1A)|Uu (DCCH)|Cell của NodeB lân cận lọt vào khoảng so với cell tốt nhất.|Ec/No, RSCP các cell',
 '#Thêm đường vô tuyến (chuyển giao mềm)',
 'rnc>nb2|NBAP RADIO LINK SETUP (hoặc ADDITION)|Iub (hoặc Iur qua RNC trôi)|Dựng radio link ở NodeB mới với cùng mã scrambling đường lên.|',
 'nb2>rnc|RADIO LINK SETUP RESPONSE|Iub|',
 'rnc>ue|ACTIVE SET UPDATE (thêm cell)|Uu|UE dùng bộ thu RAKE gộp tín hiệu nhiều NodeB (maximal ratio combining); RNC chọn khung tốt nhất ở đường lên (selection combining). Không gián đoạn.|radio link addition info',
 'ue>rnc|ACTIVE SET UPDATE COMPLETE|Uu|',
 '#Bỏ đường yếu',
 'ue>rnc|MEASUREMENT REPORT (event 1B)|Uu|Cell cũ yếu dần.|',
 'rnc>ue|ACTIVE SET UPDATE (xoá cell)|Uu||radio link removal info',
 'ue>rnc|ACTIVE SET UPDATE COMPLETE|Uu|',
 'rnc>nb|NBAP RADIO LINK DELETION|Iub|',
 '#Đổi cell phục vụ HSDPA',
 'ue>rnc|MEASUREMENT REPORT (event 1D)|Uu|HS-DSCH chỉ phát từ một cell nên đổi kiểu cứng, gián đoạn ngắn.|',
 'rnc>ue|PHYSICAL CHANNEL RECONFIGURATION (serving HS-DSCH cell change)|Uu|Nếu cell mới thuộc RNC khác lâu dài: SRNS Relocation qua lõi.|new H-RNTI, HS-SCCH info'],
g4:n=>['#Đo và báo cáo',
 'enb>ue|RRCConnectionReconfiguration (measConfig A3)|Uu|A3: lân cận tốt hơn phục vụ một offset, giữ trong time-to-trigger. Có thể kèm A5, A2/A4 cho liên tần.|a3-Offset, hysteresis, timeToTrigger, CIO, filterCoefficient',
 'ue>enb|MeasurementReport (A3)|Uu|',
 '#Chuẩn bị',
 'enb>enb2|X2AP HANDOVER REQUEST|X2-C (X2AP/SCTP)|eNB nguồn gửi ngữ cảnh và khoá KeNB* mới.|Target ECGI, E-RAB list, UE context, KeNB*, RRC context'+(n?', thông tin SgNB (nếu đổi MeNB thì nút phụ phải giải phóng hoặc giữ lại)':''),
 'enb2>enb2|Kiểm tra nhận (admission control)|—|Đủ PRB, đủ số UE, đủ GBR cho bearer QCI 1 thì nhận.|',
 'enb2>enb|HANDOVER REQUEST ACKNOWLEDGE|X2-C|Trả lệnh RRC cho UE (trong suốt qua nguồn), preamble riêng.|Target to Source Transparent Container (RRC), dedicated RACH preamble, X2-U TEID',
 '#Thực hiện',
 'enb>ue|RRCConnectionReconfiguration (mobilityControlInfo)|Uu|Lệnh chuyển giao; UE bắt đầu T304.|targetPhysCellId, newUE-Identity (C-RNTI), rach-ConfigDedicated|T304',
 'enb>enb2|SN STATUS TRANSFER|X2-C|Số thứ tự PDCP để không mất hoặc lặp gói.|UL/DL COUNT',
 'enb>enb2|Chuyển tiếp dữ liệu đường xuống|X2-U (GTP-U)|Gói còn trong bộ đệm nguồn được chuyển sang đích.|||u',
 'ue>enb2|Random Access không tranh chấp|Uu (PRACH)|Gián đoạn dữ liệu thường 30–60 ms.|',
 'ue>enb2|RRCConnectionReconfigurationComplete|Uu|',
 '#Chuyển đường dữ liệu ở lõi',
 'enb2>mme|S1AP PATH SWITCH REQUEST|S1-MME|',
 'mme>sgw|Modify Bearer Request|S11|SGW chuyển đường xuống sang eNB đích.|',
 'sgw>enb|End Marker|S1-U (GTP-U)|Đánh dấu hết gói trên đường cũ để eNB đích xếp đúng thứ tự.|||u',
 'mme>enb2|PATH SWITCH REQUEST ACKNOWLEDGE|S1-MME||',
 'enb2>enb|UE CONTEXT RELEASE|X2-C|Nguồn xoá ngữ cảnh.|'],
nsa:['#Đo cell NR',
 'enb>ue|RRCConnectionReconfiguration (measConfig NR: B1 / A3 trên PSCell)|Uu LTE|MeNB cấu hình đo NR; SgNB có thể tự cấu hình đo trong nhóm cell của nó (SRB3).|b1-ThresholdNR, a3-Offset NR',
 'ue>enb|MeasurementReport (NR)|Uu LTE|Cell NR thuộc gNB khác tốt hơn.|',
 '#Thêm nút phụ mới',
 'enb>gnb2|SgNB ADDITION REQUEST|X2-C|MeNB-initiated SgNB change.|',
 'gnb2>enb|SgNB ADDITION REQUEST ACKNOWLEDGE|X2-C||CG-Config',
 'enb>gnb|SgNB RELEASE REQUEST|X2-C|Nút phụ cũ rời đi.|',
 'gnb>enb|SgNB RELEASE REQUEST ACKNOWLEDGE|X2-C|',
 'enb>ue|RRCConnectionReconfiguration (nr-Config mới)|Uu LTE|',
 'ue>enb|RRCConnectionReconfigurationComplete|Uu LTE|',
 'enb>gnb2|SgNB RECONFIGURATION COMPLETE|X2-C|',
 'ue>gnb2|Random Access trên PSCell mới|Uu NR|',
 'gnb>gnb2|SN STATUS TRANSFER + chuyển dữ liệu|X2 (qua MeNB)|||u',
 '#Chuyển đường dữ liệu',
 'enb>mme|E-RAB MODIFICATION INDICATION|S1-MME|',
 'mme>sgw|Modify Bearer Request|S11|',
 'mme>enb|E-RAB MODIFICATION CONFIRM|S1-MME|',
 'enb>gnb|UE CONTEXT RELEASE|X2-C|Đổi PSCell trong cùng gNB thì đơn giản hơn: SgNB tự làm qua SRB3, không cần lõi.|'],
sa:['#Đo và báo cáo',
 'gnb>ue|RRCReconfiguration (measConfig A3 trên SSB/CSI-RS)|Uu NR|Đo theo búp: lọc L3 và gộp nhiều búp tốt nhất.|a3-Offset, hysteresis, timeToTrigger, nrofSS-BlocksToAverage',
 'ue>gnb|MeasurementReport (A3)|Uu NR|Có thể kèm kết quả theo từng búp.|',
 '#Chuẩn bị',
 'gnb>gnb2|XnAP HANDOVER REQUEST|Xn-C (XnAP/SCTP)|',
 'gnb2>gnb|HANDOVER REQUEST ACKNOWLEDGE|Xn-C|Trả lệnh RRC cho UE.|reconfigurationWithSync, RACH dành riêng theo búp',
 '#Thực hiện',
 'gnb>ue|RRCReconfiguration (reconfigurationWithSync)|Uu NR|5G-Advanced: CHO (chuyển giao có điều kiện, UE tự thực hiện khi đủ điều kiện) hoặc DAPS (giữ cả hai chân, gián đoạn ~0 ms).|spCellConfig, newUE-Identity, t304|T304',
 'gnb>gnb2|SN STATUS TRANSFER|Xn-C|',
 'gnb>gnb2|Chuyển tiếp dữ liệu|Xn-U|||u',
 'ue>gnb2|Random Access (không tranh chấp, theo búp)|Uu NR|',
 'ue>gnb2|RRCReconfigurationComplete|Uu NR|',
 '#Chuyển đường dữ liệu ở lõi',
 'gnb2>amf|NGAP PATH SWITCH REQUEST|N2|',
 'amf>smf|Nsmf_PDUSession_UpdateSMContext|N11|',
 'smf>upf|PFCP SESSION MODIFICATION (TEID gNB đích)|N4|',
 'upf>gnb|End Marker|N3 (GTP-U)|||u',
 'smf>amf|UpdateSMContext Response|N11|',
 'amf>gnb2|PATH SWITCH REQUEST ACKNOWLEDGE|N2|',
 'gnb2>gnb|UE CONTEXT RELEASE|Xn-C|']},
kpi:{g3:['Soft HO Success Rate','Soft HO overhead (số RL trung bình)','HSDPA serving cell change SR'],g4:['Intra-freq HO Success Rate','HO Preparation SR / Execution SR','HO interruption time','Too early / too late HO (MRO)'],nsa:['SgNB Change Success Rate','PSCell Change Success Rate','SCG Failure Rate'],sa:['Intra-NR HO Success Rate','HO interruption time','Ping-pong HO rate']},
err:[['HO quá muộn → rớt (RLF trước HO)','a3-Offset/TTT lớn, CIO sai','RLF report, MRO; giảm TTT hoặc offset'],['HO quá sớm, ping-pong','Offset nhỏ, hysteresis thấp','Thống kê ping-pong, tăng hysteresis'],['HO Preparation fail','Đích từ chối do tải, thiếu neighbour X2/Xn, ngữ cảnh lỗi','Cause trong HANDOVER PREPARATION FAILURE; ANR'],['HO Execution fail','RACH ở đích lỗi, phủ yếu, sai PCI (xung đột PCI)','Kiểm PCI confusion, PRACH đích']],
tab:[['hx','Chuyển giao'],['mob','Di động và điều hướng'],['radio','Phủ sóng'],['kpi','KPI chuyển giao']],
ref:{g3:'TS 25.331 mục 8.3.4 (Active Set Update), 25.433 (NBAP)',g4:'TS 36.300 mục 10.1.2, 36.423 (X2AP)',nsa:'TS 37.340 mục 10.5, 10.3',sa:'TS 38.300 mục 9.2.3, 38.423 (XnAP)'},
t:{g3:'Mềm: không gián đoạn',g4:'Gián đoạn 30–60 ms',nsa:'Gián đoạn chân NR 30–80 ms',sa:'Gián đoạn 20–50 ms; DAPS ~ 0 ms'}});

E2S.push({id:'irat',g:'Di động và chuyển giao',n:'Chuyển giao giữa các công nghệ (liên hệ thống)',
d:'Ra khỏi vùng phủ công nghệ mới: 3G chuyển lên 4G, 4G đang gọi VoLTE thì SRVCC xuống 3G, NSA mất NR thì về LTE, 5G SA chuyển sang 4G qua N26.',
f:{
g3:['#Đo 4G',
 'rnc>ue|MEASUREMENT CONTROL (E-UTRA, event 3C)|Uu|Cấu hình đo LTE trong lúc có dữ liệu.|E-UTRA frequency list, threshold 3C',
 'ue>rnc|MEASUREMENT REPORT (3C)|Uu|LTE đủ tốt.|',
 '#Đưa lên 4G',
 'rnc>ue|RRC CONNECTION RELEASE (redirection E-UTRA)|Uu|Cách thường gặp ở 3G→4G: redirection (cũng có thể PS HO).|redirectionInfo: E-UTRA EARFCN',
 'ue>enb|Random Access + RRCConnectionRequest|Uu LTE|',
 'ue>mme|TRACKING AREA UPDATE REQUEST (GUTI ánh xạ từ P-TMSI)|NAS EMM|',
 'mme>sgsn|Context Request|S3/Gn|MME lấy ngữ cảnh MM và PDP từ SGSN cũ; PDP context chuyển thành EPS bearer.|P-TMSI, RAI',
 'sgsn>mme|Context Response|S3/Gn||MM context, PDP contexts → EPS bearers',
 'mme>sgw|Create Session Request|S11|GGSN thường hội tụ với PGW nên IP giữ nguyên.|',
 'mme>hlr|Update-Location-Request|S6a (HSS)|HSS huỷ ở SGSN cũ.|',
 'mme>ue|TRACKING AREA UPDATE ACCEPT|NAS EMM||']
,g4:['#Đo khi đang gọi VoLTE',
 'enb>ue|RRCConnectionReconfiguration (measConfig B2 UTRA)|Uu|B2: LTE dưới ngưỡng 1 và 3G trên ngưỡng 2.|b2-Threshold1 (RSRP), b2-Threshold2UTRA (RSCP)',
 'ue>enb|MeasurementReport (B2)|Uu|',
 '#Chuẩn bị SRVCC',
 'enb>mme|HANDOVER REQUIRED (SRVCC HO Indication)|S1-MME|eNB chỉ ra thoại cần chuyển sang CS.|Target RNC ID, SRVCC HO Indication: CS only / PS and CS',
 'mme>msc|SRVCC PS to CS Request|Sv (GTPv2-C)|MME tách bearer thoại QCI 1, gửi sang MSC hỗ trợ SRVCC.|STN-SR, C-MSISDN, MM context, Source to Target container',
 'msc>rnc|RANAP RELOCATION REQUEST|Iu-CS|MSC (qua MSC đích) chuẩn bị tài nguyên 3G.|RAB thoại AMR',
 'rnc>msc|RELOCATION REQUEST ACKNOWLEDGE|Iu-CS|',
 'msc>scscf|INVITE (STN-SR)|I2 → IMS (ATCF/SCC AS)|IMS chuyển nhánh truy nhập của phiên từ PS sang CS; ATCF giúp chỉ đổi đoạn gần, đầu xa không biết.|||s',
 'scscf>tas|INVITE → SCC AS chuyển phiên|ISC|||s',
 'msc>mme|SRVCC PS to CS Response|Sv|',
 '#Thực hiện',
 'mme>enb|HANDOVER COMMAND|S1-MME|',
 'enb>ue|MobilityFromEUTRACommand (UTRA, CS)|Uu|',
 'ue>rnc|HANDOVER TO UTRAN COMPLETE|Uu UMTS|Gián đoạn tiếng thường 100–300 ms.|',
 'rnc>msc|RELOCATION COMPLETE|Iu-CS|',
 'msc>mme|SRVCC PS to CS Complete Notification|Sv|',
 'mme>sgw|Delete Bearer Command (QCI 1)|S11|Bearer dữ liệu khác chuyển sang 3G (DTM/PS HO) hoặc treo.|',
 'ue>pstn|Thoại tiếp tục trên miền CS|Uu → Iub → Iu-CS → MGW||||u'],
nsa:['#Mất NR',
 'ue>ue|Mất đồng bộ trên PSCell NR (T310 hết)|Uu NR|Sóng NR yếu, vật cản hoặc nhiễu.|T310, N310 (SCG)',
 'ue>enb|SCGFailureInformationNR|Uu LTE|Chỉ chân NR hỏng; kết nối LTE vẫn giữ nên không rớt.|failureType: t310-Expiry / randomAccessProblem / rlc-MaxNumRetx / scg-ChangeFailure',
 '#Giải phóng nút phụ',
 'enb>gnb|SgNB RELEASE REQUEST|X2-C|',
 'gnb>enb|SgNB RELEASE REQUEST ACKNOWLEDGE|X2-C|',
 'gnb>enb|SN STATUS TRANSFER + chuyển dữ liệu|X2-U|PDCP chuyển về eNB.|||u',
 'enb>ue|RRCConnectionReconfiguration (xoá nr-Config)|Uu LTE|',
 'ue>enb|RRCConnectionReconfigurationComplete|Uu LTE|',
 '#Đường dữ liệu về eNB',
 'enb>mme|E-RAB MODIFICATION INDICATION|S1-MME|S1-U chuyển từ gNB về eNB.|',
 'mme>sgw|Modify Bearer Request|S11|',
 'mme>enb|E-RAB MODIFICATION CONFIRM|S1-MME|Khi NR tốt lại, MeNB thêm SgNB như kịch bản lập phiên dữ liệu.|']
,sa:['#Đo 4G',
 'gnb>ue|RRCReconfiguration (measConfig B2/A2 + B1 E-UTRA)|Uu NR|',
 'ue>gnb|MeasurementReport|Uu NR|',
 '#Chuẩn bị qua N26',
 'gnb>amf|HANDOVER REQUIRED (đích eNB)|N2|',
 'amf>smf|Nsmf_PDUSession_Context Request|N11|SMF+PGW-C trả ngữ cảnh bearer EPS ánh xạ từ QoS flow.|',
 'amf>mme|Forward Relocation Request|N26 (GTPv2-C)|',
 'mme>sgw|Create Session Request|S11|',
 'mme>enb|HANDOVER REQUEST|S1-MME|',
 'enb>mme|HANDOVER REQUEST ACKNOWLEDGE|S1-MME|',
 'mme>amf|Forward Relocation Response|N26|',
 '#Thực hiện',
 'amf>gnb|HANDOVER COMMAND|N2|',
 'gnb>ue|MobilityFromNRCommand (E-UTRA)|Uu NR|',
 'ue>enb|RRCConnectionReconfigurationComplete|Uu LTE|',
 'enb>mme|HANDOVER NOTIFY|S1-MME|',
 'mme>sgw|Modify Bearer Request|S11|',
 'sgw>smf|Modify Bearer Request|S5-C|PGW-C (SMF) cập nhật; UPF (PGW-U) giữ nguyên nên IP không đổi.|',
 'smf>upf|PFCP SESSION MODIFICATION|N4|',
 'ue>mme|TRACKING AREA UPDATE REQUEST|NAS EMM|Không có N26 thì không HO được: dùng redirection và UE mang PDU session sang bằng attach với cờ handover.|']},
use:{g3:['enb','mme','sgw'],g4:['nb'],sa:['enb','mme','sgw']},
kpi:{g3:['IRAT 3G→4G redirection SR','Tỷ lệ thời gian ở 4G'],g4:['SRVCC Success Rate','SRVCC preparation/execution SR','Thời gian gián đoạn thoại'],nsa:['SCG Failure Rate theo cause','SgNB Abnormal Release Rate'],sa:['5G→4G HO Success Rate (N26)','Tỷ lệ thời gian ở 5G']},
err:[['SRVCC chuẩn bị thất bại','Thiếu STN-SR trong HSS, MSC không hỗ trợ Sv, RNC từ chối','ULA có STN-SR/C-MSISDN; cause PS to CS Response'],['SCG failure nhiều (NSA)','Phủ NR mỏng, B1 quá thấp, PRACH NR lỗi','SCG failure theo failureType, tăng b1-ThresholdNR'],['5G→4G mất IP','Không có N26, cấu hình SMF+PGW-C không hội tụ','N26, DNS chọn SMF/PGW-C combined'],['Kẹt 3G sau khi gọi','Không cấu hình fast return, ưu tiên LTE trong SIB19 thấp','SIB19 priority, redirection E-UTRA']],
tab:[['hx','Chuyển giao'],['it','Liên mạng, OTT'],['mob','Di động và điều hướng'],['vo','VoLTE']],
ref:{g3:'TS 23.401 mục 5.3.3 (TAU liên hệ thống), 25.331',g4:'TS 23.216 (SRVCC), 29.280 (Sv)',nsa:'TS 37.340 mục 10.4 (SCG failure), 36.331',sa:'TS 23.502 mục 4.11 (liên mạng EPS qua N26)'},
t:{g3:'1–2 s (redirection)',g4:'Gián đoạn thoại 100–300 ms',nsa:'Chân LTE không gián đoạn',sa:'Gián đoạn 50–150 ms'}});
/* D — Cước, SMS, roaming, tắt máy */
E2S.push({id:'chg',g:'Cước, SMS, roaming, tắt máy',n:'Tính cước trực tuyến và chính sách theo gói',
d:'Thuê bao trả trước dùng dữ liệu và thoại: cổng dữ liệu xin hạn mức từ hệ thống cước trực tuyến, báo phần đã dùng, bị chặn hoặc chuyển hướng khi hết; hết dung lượng tốc độ cao thì chính sách hạ băng thông.',
f:{
g3:['#Mở phiên cước dữ liệu',
 'ggsn>ocs|CCR-Initial|Gy (Diameter DCCA)|Sau khi PDP context được tạo, GGSN xin hạn mức cho từng rating group.|Subscription-Id (MSISDN), Called-Station-Id (APN), Rating-Group, 3GPP-RAT-Type=UTRAN',
 'ocs>ocs|Kiểm tra tài khoản, đặt trước hạn mức|—|Tính giá theo gói, trừ tạm (reserve).|',
 'ocs>ggsn|CCA-Initial|Gy|Cấp hạn mức dung lượng/thời gian, thời hạn hiệu lực.|Granted-Service-Unit (CC-Total-Octets), Validity-Time, Volume-Quota-Threshold',
 '#Dùng và cập nhật',
 'ue>inet|Lưu lượng dữ liệu|Gi|GGSN đếm theo rating group (dịch vụ khác nhau có thể giá khác nhau).|||u',
 'ggsn>ocs|CCR-Update|Gy|Dùng gần hết hạn mức (chạm ngưỡng) hoặc hết Validity-Time: báo phần đã dùng và xin thêm.|Used-Service-Unit, Requested-Service-Unit, Reporting-Reason',
 'ocs>ggsn|CCA-Update|Gy|Cấp tiếp hạn mức.|Granted-Service-Unit',
 '#Hết tiền',
 'ocs>ggsn|CCA-Update (Final-Unit-Indication)|Gy|Đây là phần cuối: hết thì chặn (TERMINATE) hoặc chuyển hướng tới trang nạp tiền (REDIRECT).|Final-Unit-Action, Redirect-Server',
 'ggsn>ue|Chuyển hướng HTTP tới cổng nạp tiền|Gi|||u',
 '#Thoại trả trước (CAMEL)',
 'msc>ocs|CAP InitialDP|CAP (CAMEL)|MSC thấy cờ O-CSI trong hồ sơ thuê bao, hỏi IN/OCS trước khi nối cuộc gọi.|Service key, Calling/Called number, Location',
 'ocs>msc|CAP ApplyCharging + Continue|CAP|Cho phép gọi trong một khoảng thời gian; hết khoảng thì MSC báo lại (ApplyChargingReport).|Max call period duration',
 '#Đóng phiên và CDR',
 'ggsn>ocs|CCR-Terminate|Gy|Huỷ PDP context hoặc tắt máy: báo phần dùng cuối, OCS trả lại phần đặt trước chưa dùng.|Used-Service-Unit, Termination-Cause',
 'ggsn>cg|CDR (G-CDR) — cước sau|Ga (GTP\')|SGSN cũng tạo S-CDR; CGF gom file CDR gửi billing (cho trả sau và đối soát).|Charging ID, volume uplink/downlink, thời gian'],
g4:n=>['#Chính sách và hạn mức khi lập phiên',
 'pgw>pcrf|CCR-Initial|Gx|PCRF tra gói cước của thuê bao.|IMSI, APN, RAT-Type',
 'pcrf>ocs|Sy SLR (đăng ký trạng thái hạn mức)|Sy (Diameter)|PCRF đăng ký nhận báo khi bộ đếm tiêu dùng (ví dụ dung lượng tốc độ cao của gói) đổi trạng thái.|Policy-Counter-Identifier',
 'pcrf>pgw|CCA-Initial|Gx|PCC rule theo gói: QCI, APN-AMBR, rating group, chế độ online/offline.|Charging-Rule-Install, APN-AMBR, Online=1',
 'pgw>ocs|CCR-Initial|Gy|Xin hạn mức.|Rating-Group, 3GPP-RAT-Type=EUTRAN, User-Location-Info (TAI/ECGI)',
 'ocs>pgw|CCA-Initial|Gy||Granted-Service-Unit, Validity-Time',
 '#Dùng và cập nhật',
 'ue>inet|Lưu lượng dữ liệu|SGi|||u',
 'pgw>ocs|CCR-Update / CCA-Update|Gy|Báo dùng, xin thêm; đổi vị trí (ULI) hoặc đổi RAT cũng có thể kích hoạt báo cáo.|Used-Service-Unit, Trigger-Type',
 ...(n?['#Báo lưu lượng NR riêng (NSA)',
 'enb>mme|SECONDARY RAT DATA USAGE REPORT|S1-MME|MeNB báo dung lượng đã đi qua chân NR (gNB đếm và báo qua X2).|E-RAB, Secondary RAT type NR, usage count UL/DL theo khoảng thời gian',
 'mme>sgw|Change Notification / Modify Access Bearers (Secondary RAT usage)|S11 → S5|Chuyển số liệu tới SGW, PGW để ghi vào CDR.|',
 'pgw>cg|PGW-CDR có trường RAN Secondary RAT Usage Report|Gz|Nhà mạng có thể tính giá riêng cho lưu lượng 5G NSA.|']:[]),
 '#Hết dung lượng tốc độ cao (hạ băng thông)',
 'ocs>pcrf|Sy SNR (trạng thái bộ đếm đổi)|Sy|Bộ đếm “tốc độ cao” đã hết.|Policy-Counter-Status: exhausted',
 'pcrf>pgw|Gx RAR (AMBR thấp hơn)|Gx|Hạ APN-AMBR (ví dụ 1 Mbps) thay vì chặn hẳn.|APN-AMBR mới',
 'pgw>mme|Update Bearer Request (AMBR mới)|S5 → S11 → S1|MME báo eNB và UE AMBR mới.|',
 '#Thoại VoLTE trả trước',
 'tas>ocs|Ro CCR-Initial (thoại)|Ro (Diameter)|TAS hoặc S-CSCF (IMS gateway function) xin hạn mức phút gọi.|Service-Context-Id (MMTel), Called-Party-Address',
 'ocs>tas|CCA-Initial|Ro|Cấp phút; hết thì TAS gửi BYE cắt cuộc gọi.|Granted-Service-Unit (CC-Time)',
 '#Đóng phiên và CDR',
 'pgw>ocs|CCR-Terminate|Gy|',
 'pgw>cg|PGW-CDR, SGW-CDR|Gz/Ga|'],
sa:['#Chính sách và cước khi lập phiên PDU',
 'smf>pcf|Npcf_SMPolicyControl_Create|N7|',
 'pcf>chf|Nchf_SpendingLimitControl_Subscribe|N28|Tương đương Sy: theo dõi bộ đếm của gói.|Policy counter IDs',
 'pcf>smf|SM Policy Response (PCC rule, chế độ cước)|N7||Charging data (rating group, online/offline)',
 'smf>chf|Nchf_ConvergedCharging_Create|N40 (SBI)|CHF gộp online và offline: vừa cấp hạn mức vừa tạo CDR.|Multiple Unit Usage, rating group, RAT type NR, User location',
 'chf>smf|Create Response (cấp hạn mức)|N40||Granted Unit, Validity time, triggers',
 'smf>upf|PFCP: cài URR (Usage Reporting Rule)|N4|UPF đếm theo ngưỡng dung lượng/thời gian và báo lại SMF.|URR: Volume Threshold, Time Threshold, Measurement method',
 '#Dùng và cập nhật',
 'ue>inet|Lưu lượng dữ liệu|N6|||u',
 'upf>smf|PFCP SESSION REPORT (Usage Report)|N4|UPF chạm ngưỡng URR.|Volume Measurement, Usage Report Trigger',
 'smf>chf|Nchf_ConvergedCharging_Update|N40|Báo phần dùng, xin thêm.|Used Unit Container',
 'chf>smf|Update Response|N40|',
 '#Hết dung lượng tốc độ cao',
 'chf>pcf|Nchf_SpendingLimitControl_Notify|N28|Bộ đếm hết.|',
 'pcf>smf|SMPolicyControl_UpdateNotify (Session-AMBR thấp)|N7|',
 'smf>upf|PFCP: QER mới|N4|UPF giới hạn tốc độ; SMF cũng báo UE qua PDU Session Modification.|',
 '#Thoại VoNR trả trước',
 'tas>chf|Nchf_ConvergedCharging (IMS) hoặc Ro|Ro/Nchf|',
 '#Đóng phiên và CDR',
 'smf>chf|Nchf_ConvergedCharging_Release|N40|CHF tạo CDR gửi billing qua Bx.|',
 'chf>cg|CHF-CDR|Bx|']},
kpi:{g3:['Gy CCR success rate','OCS response time','Tỷ lệ phiên bị Final-Unit'],g4:['Gx/Gy CCR success rate','Diameter timeout rate','Tỷ lệ thuê bao bị hạ băng thông'],nsa:['Secondary RAT usage reported volume','Gy success rate'],sa:['N40 success rate','N4 usage report rate','CHF response time']},
err:[['Thuê bao còn tiền vẫn bị chặn','Gy timeout, OCS trả DIAMETER_CREDIT_LIMIT_REACHED (4012), Credit-Control-Failure-Handling = TERMINATE','Trace Gy, CCFH (CONTINUE/RETRY_AND_TERMINATE), Tx timer'],['Dùng vượt hạn mức (rò cước)','Validity-Time dài, ngưỡng báo cáo lớn, CDR mất','Đối soát CDR với Gy, Volume-Quota-Threshold'],['Hết gói nhưng không hạ băng thông','Sy/N28 không đăng ký, PCRF chưa có rule','Trace Sy SLR/SNR, PCC rule mặc định'],['Lưu lượng 5G NSA không tách được','Không bật Secondary RAT usage report trên eNB/gNB','Tham số báo cáo ở eNB, trường CDR']],
tab:[['core','Mạng lõi: tính cước'],['sv','Dịch vụ 4G/5G'],['fw','Tường lửa']],
ref:{g3:'TS 32.251, 32.299 (Diameter charging), 23.078 (CAMEL)',g4:'TS 23.203 (PCC), 29.212 (Gx), 29.219 (Sy), 32.299 (Gy/Ro)',nsa:'TS 23.401 mục 5.7A (Secondary RAT usage), 32.298',sa:'TS 32.290, 32.291 (Nchf), 29.594 (N28), 29.244 (URR)'},
t:{g3:'CCR/CCA 20–100 ms mỗi lượt',g4:'20–100 ms',nsa:'Báo Secondary RAT theo chu kỳ',sa:'10–50 ms (SBI)'}});

E2S.push({id:'sms',g:'Cước, SMS, roaming, tắt máy',n:'Gửi và nhận tin nhắn SMS',
d:'SMS đi qua kênh báo hiệu, không cần dữ liệu. 3G qua MSC, 4G qua SGs về MSC (hoặc SMS over IMS), 5G SA qua NAS tới SMSF. Phần gửi đi (MO) tới SMSC, rồi SMSC giao tới người nhận (MT).',
f:{
g3:['#Gửi đi (MO)',...e2R3('originatingLowPrioritySignalling').slice(0,1),
 'ue>msc|CM SERVICE REQUEST (SMS)|NAS MM (Iu-CS)||CM service type: Short message service',
 'msc>rnc|SECURITY MODE|Iu-CS → Uu|',
 'ue>msc|CP-DATA (RP-DATA: SMS-SUBMIT)|NAS SMS (CP/RP/TL)|Ba lớp: CP (điều khiển), RP (chuyển tiếp), TPDU (nội dung).|RP-Destination (địa chỉ SMSC), TP-DA (số nhận), TP-UD (nội dung ≤ 140 byte), TP-DCS|TC1M',
 'msc>ue|CP-ACK|NAS SMS|',
 'msc>smsc|MAP MO-FORWARD-SHORT-MESSAGE|E (MAP, qua IWMSC)|',
 'smsc>msc|MO-FORWARD-SM ACK|MAP|',
 'msc>ue|CP-DATA (RP-ACK)|NAS SMS|Máy báo “đã gửi”.|',
 '#Giao tới người nhận (MT)',
 'smsc>hlr|MAP SEND ROUTING INFO FOR SM|C (MAP)|Hỏi HLR người nhận đang ở MSC/SGSN nào.|MSISDN',
 'hlr>smsc|SRI-SM ACK|C|Nếu máy đang tắt: HLR ghi cờ chờ (MWD), SMSC thử lại khi máy bật.|IMSI, MSC/VLR number',
 'smsc>msc|MAP MT-FORWARD-SHORT-MESSAGE|E (MAP)|',
 'msc>rnc|PAGING|Iu-CS|',
 'ue>msc|PAGING RESPONSE|NAS|',
 'msc>ue|CP-DATA (RP-DATA: SMS-DELIVER)|NAS SMS|',
 'ue>msc|CP-ACK, CP-DATA (RP-ACK), CP-ACK|NAS SMS|',
 'msc>smsc|MT-FORWARD-SM ACK|MAP|SMSC có thể gửi báo cáo trạng thái (SMS-STATUS-REPORT) cho người gửi.|'],
g4:n=>['#Gửi đi (MO) qua SGs',
 'ue>mme|UPLINK NAS TRANSPORT (CP-DATA/RP-DATA SMS-SUBMIT)|NAS EMM|UE đã attach kết hợp EPS/IMSI. Nếu rỗi: Service Request trước.|NAS message container',
 'mme>msc|SGsAP-UPLINK-UNITDATA|SGs (SGsAP/SCTP)|MME không hiểu SMS, chuyển nguyên gói cho MSC/VLR.|IMSI, NAS message container',
 'msc>smsc|MAP MO-FORWARD-SHORT-MESSAGE|E (MAP)|',
 'smsc>msc|MO-FSM ACK|MAP|',
 'msc>mme|SGsAP-DOWNLINK-UNITDATA (RP-ACK)|SGs|',
 'mme>ue|DOWNLINK NAS TRANSPORT|NAS EMM|',
 '#Giao tới người nhận (MT)',
 'smsc>hss|SRI-SM (HLR/HSS)|C (MAP) hoặc S6c|Trả địa chỉ MSC (hoặc MME nếu SMS in MME, hoặc IP-SM-GW nếu SMS over IMS).|',
 'smsc>msc|MAP MT-FORWARD-SHORT-MESSAGE|E (MAP)|',
 'msc>mme|SGsAP-PAGING-REQUEST (SMS indicator)|SGs|',
 'mme>enb|S1AP PAGING|S1-MME|',
 'ue>mme|SERVICE REQUEST|NAS EMM|Không phải CSFB: SMS ở lại LTE.|',
 'msc>mme|SGsAP-DOWNLINK-UNITDATA (SMS-DELIVER)|SGs|',
 'mme>ue|DOWNLINK NAS TRANSPORT|NAS EMM|',
 'ue>mme|UPLINK NAS TRANSPORT (CP-ACK, RP-ACK)|NAS EMM|',
 'mme>msc|SGsAP-UPLINK-UNITDATA|SGs|',
 'msc>smsc|MT-FSM ACK|MAP|Cách khác: SMS over IMS — UE gửi SIP MESSAGE, IP-SM-GW chuyển sang MAP.|'],
sa:['#Đăng ký dịch vụ SMS qua NAS',
 'ue>amf|REGISTRATION REQUEST (SMS over NAS supported)|NAS 5GMM|',
 'amf>smsf|Nsmsf_SMService_Activate|N20 (SBI)|AMF chọn SMSF (theo hồ sơ UDM).|',
 'smsf>udm|Nudm_UECM_Registration (SMSF)|N21|UDM ghi SMSF phục vụ để SMSC tìm được khi giao SMS.|',
 '#Gửi đi (MO)',
 'ue>amf|UL NAS TRANSPORT (payload: SMS)|NAS 5GMM|',
 'amf>smsf|Nsmsf_SMService_UplinkSMS|N20|',
 'smsf>smsc|MO-FORWARD-SHORT-MESSAGE|MAP / Diameter SGd|',
 'smsc>smsf|ACK|MAP/SGd|',
 'smsf>amf|Namf_Communication_N1N2MessageTransfer (RP-ACK)|N20 (SBI)|',
 'amf>ue|DL NAS TRANSPORT|NAS 5GMM|',
 '#Giao tới người nhận (MT)',
 'smsc>udm|SRI-SM (qua UDM/HSS)|C/S6c|Trả địa chỉ SMSF.|',
 'smsc>smsf|MT-FORWARD-SHORT-MESSAGE|MAP/SGd|',
 'smsf>amf|N1N2MessageTransfer|N20|UE rỗi → AMF tìm gọi.|',
 'amf>gnb|NGAP PAGING|N2|',
 'ue>amf|SERVICE REQUEST|NAS 5GMM|',
 'amf>ue|DL NAS TRANSPORT (SMS-DELIVER)|NAS 5GMM|',
 'ue>amf|UL NAS TRANSPORT (RP-ACK)|NAS 5GMM|',
 'smsf>smsc|MT-FSM ACK|MAP/SGd|']},
kpi:{g3:['SMS MO/MT Success Rate','SMS delivery time'],g4:['SMS over SGs Success Rate','SGs paging success'],sa:['SMS over NAS Success Rate']},
err:[['Không nhận được SMS khi ở 4G','Liên kết SGs mất (MME reset), UE attach EPS-only','SGsAP status, attach type, cờ “SMS only”'],['Tin đến chậm','Paging thất bại, SMSC thử lại theo chu kỳ dài','Paging SR, retry schedule ở SMSC'],['Báo “gửi thất bại” RP-ERROR','Sai số SMSC trên SIM, thuê bao bị chặn','RP-Cause; số SMSC; hồ sơ ODB']],
tab:[['core','Mạng lõi'],['it','Liên mạng, OTT'],['sig','Báo hiệu']],
ref:{g3:'TS 23.040, 24.011 (CP/RP)',g4:'TS 23.272 mục 8 (SMS over SGs), 29.118',nsa:'Như 4G',sa:'TS 23.502 mục 4.13.3 (SMS over NAS), 29.540 (Nsmsf)'},
t:{g3:'1–3 s',g4:'1–3 s',nsa:'Như 4G',sa:'1–2 s'}});

/* roaming: vị trí và liên kết riêng */
E2S.push({id:'roam',g:'Cước, SMS, roaming, tắt máy',n:'Chuyển vùng quốc tế (roaming)',
d:'Thuê bao ra nước ngoài: đăng ký ở mạng khách nhưng xác thực và hồ sơ ở mạng nhà; dữ liệu thường quay về mạng nhà (home-routed) qua mạng trung chuyển GRX/IPX.',
lab:{g3:{sgsn:'SGSN (khách)',msc:'MSC/VLR (khách)',hlr:'HLR (nhà)',ggsn:'GGSN (nhà)',ocs:'OCS (nhà)'},g4:{mme:'MME (khách)',sgw:'SGW (khách)',hss:'HSS (nhà)',pgw:'PGW (nhà)',pcrf:'PCRF (nhà)',ocs:'OCS (nhà)'},nsa:{mme:'MME (khách)',sgw:'SGW (khách)',hss:'HSS (nhà)',pgw:'PGW (nhà)',pcrf:'PCRF (nhà)',ocs:'OCS (nhà)'},sa:{amf:'AMF (khách)',smf:'V-SMF (khách)',upf:'V-UPF (khách)',ausf:'AUSF (nhà)',udm:'UDM (nhà)',pcf:'PCF (nhà)',chf:'CHF (nhà)'}},
pos:{g3:{ipx:[540,200],hlr:[700,95],ggsn:[700,300],ocs:[860,330],pcrf:[860,225],smsc:[860,95],pstn:[860,20],inet:[880,415]},g4:{ipx:[480,160],hss:[640,40],pgw:[640,245],pcrf:[790,160],ocs:[790,320],inet:[920,245]},nsa:{ipx:[480,160],hss:[640,40],pgw:[640,245],pcrf:[790,160],ocs:[790,320],inet:[920,245]},sa:{upf:[330,300],smf:[330,200],sepv:[470,120],seph:[620,120],ausf:[770,40],udm:[900,40],pcf:[900,160],chf:[900,260],smfh:[770,230],upfh:[620,330],inet:[900,360],pcscf:[480,410],scscf:[620,410],tas:[770,410]}},
rm:{g3:['sgsn|ggsn','sgsn|hlr','msc|hlr'],g4:['sgw|pgw','mme|hss'],nsa:['sgw|pgw','mme|hss'],sa:['amf|ausf','amf|udm','smf|udm','smf|pcf','smf|chf','amf|pcf','upf|inet']},
lk:{g3:[['sgsn','ipx','Gp/Gr','cu'],['msc','ipx','D (MAP)','c'],['ipx','ggsn','Gp','cu'],['ipx','hlr','MAP (SCCP GT)','c']],g4:[['sgw','ipx','S8','cu'],['mme','ipx','S6a','c'],['ipx','pgw','S8','cu'],['ipx','hss','S6a (DEA)','c']],nsa:[['sgw','ipx','S8','cu'],['mme','ipx','S6a','c'],['ipx','pgw','S8','cu'],['ipx','hss','S6a (DEA)','c']],sa:[['amf','sepv','SBI','c'],['smf','sepv','SBI','c'],['sepv','seph','N32','c'],['seph','ausf','SBI','c'],['seph','udm','SBI','c'],['seph','smfh','N16','c'],['smfh','pcf','N7','c'],['smfh','chf','N40','c'],['smfh','udm','N10','c'],['smfh','upfh','N4','c'],['upf','upfh','N9','u'],['upfh','inet','N6','u'],['seph','pcf','N15/N24','c']]},
use:{g3:['ipx'],g4:['ipx'],nsa:['ipx'],sa:['sepv','seph','smfh','upfh']},
f:{
g3:['#Chọn mạng khách',
 'ue>ue|Chọn PLMN khách|SIM (EF OPLMNwACT, FPLMN)|Ưu tiên danh sách mạng đối tác trên SIM; mạng nhà có thể “lái” (steering of roaming) bằng cách từ chối vài lần đăng ký.|MCC/MNC, danh sách ưu tiên',
 '#Đăng ký với hồ sơ ở mạng nhà',
 'ue>sgsn|ATTACH REQUEST (IMSI của mạng nhà)|NAS GMM|',
 'sgsn>hlr|MAP SEND AUTHENTICATION INFO|Gr qua SCCP Global Title quốc tế|Định tuyến báo hiệu SS7 bằng GT (E.214 từ IMSI).|IMSI',
 'hlr>sgsn|Vector xác thực|MAP|',
 'sgsn>ue|AUTHENTICATION / SECURITY|NAS GMM|',
 'sgsn>hlr|MAP UPDATE GPRS LOCATION|Gr|HLR kiểm thoả thuận roaming, cờ cấm roaming dữ liệu.|',
 'hlr>sgsn|MAP INSERT SUBSCRIBER DATA|Gr|Hồ sơ: APN được phép dùng ở khách, cờ VPLMN address allowed.|',
 'sgsn>ue|ATTACH ACCEPT|NAS GMM|',
 'msc>hlr|MAP UPDATE LOCATION (miền CS)|D qua GT quốc tế|Để nhận cuộc gọi: cuộc gọi về số nhà sẽ được HLR chỉ tới MSRN của MSC khách.|',
 '#Dữ liệu quay về mạng nhà',
 'ue>sgsn|ACTIVATE PDP CONTEXT REQUEST|NAS SM|',
 'sgsn>ggsn|CREATE PDP CONTEXT REQUEST|Gp (GTP qua GRX)|SGSN khách phân giải APN qua DNS GRX (.gprs) ra GGSN nhà.|APN.mnc.mcc.gprs',
 'ggsn>sgsn|CREATE PDP CONTEXT RESPONSE|Gp|',
 'ue>inet|Dữ liệu (home-routed)|Uu → Iu-PS → Gp (GRX) → GGSN nhà → Gi|Trễ cao hơn do đi vòng về nước nhưng nhà mạng nhà kiểm soát được cước và chính sách.|||u',
 '#Cước và đối soát',
 'ggsn>ocs|CCR (trả trước, thời gian thực ở mạng nhà)|Gy|',
 'sgsn>sgsn|CDR khách → file TAP (TD.57)|—|Mạng khách gửi file TAP qua clearing house để tính tiền mạng nhà.|']
,g4:n=>['#Đăng ký ở mạng khách',
 'ue>mme|ATTACH REQUEST|NAS EMM|',
 'mme>hss|AIR (vector xác thực)|S6a qua IPX (DEA/DRA)|Diameter Edge Agent định tuyến theo Destination-Realm (epc.mnc.mcc.3gppnetwork.org); hai bên có thể lọc theo GSMA FS.19.|IMSI, Visited-PLMN-Id',
 'hss>mme|AIA|S6a|',
 'mme>ue|AUTHENTICATION / SECURITY MODE|NAS EMM|',
 'mme>hss|ULR|S6a|',
 'hss>mme|ULA (hồ sơ, VPLMN-Dynamic-Address-Allowed, cờ cấm roaming)|S6a|Quyết định home-routed hay local breakout cho từng APN.|APN-Configuration, VPLMN-Dynamic-Address-Allowed',
 '#Dữ liệu quay về mạng nhà (S8HR)',
 'mme>sgw|Create Session Request|S11|',
 'sgw>pgw|Create Session Request|S8 (GTPv2 qua IPX)|SGW khách nối PGW nhà.|',
 'pgw>pcrf|CCR-Initial (Gx nhà)|Gx|',
 'pgw>sgw|Create Session Response|S8|',
 'ue>inet|Dữ liệu (home-routed)|Uu → S1-U → SGW khách → S8 (IPX) → PGW nhà → SGi|'+(n?'NSA ở mạng khách cần thêm thoả thuận cho NR (Access-Restriction-Data và thuộc tính trong TAP).':'Local breakout: PGW ở mạng khách, trễ thấp nhưng chính sách/cước do mạng khách làm.')+'|||u',
 '#Thoại VoLTE roaming',
 'pgw>pgw|VoLTE S8HR: IMS ở mạng nhà|S8|P-CSCF ở mạng nhà; bearer QCI 1 đi qua S8 nên cần IPX bảo đảm QoS. Mạng khách không có IMS cho thuê bao này.|',
 '#Cước và đối soát',
 'pgw>ocs|Gy CCR (trả trước, mạng nhà)|Gy|',
 'sgw>sgw|SGW-CDR → TAP (TD.57) hoặc BCE|—|Mạng khách đối soát với mạng nhà qua clearing house.|']
,sa:['#Đăng ký với xác thực ở mạng nhà',
 'ue>amf|REGISTRATION REQUEST (SUCI)|NAS 5GMM|SUCI giấu SUPI: mạng khách không biết IMSI trước khi mạng nhà cho phép.|SUCI (Home Network Identifier, Protection Scheme)',
 'amf>ausf|Nausf_UEAuthentication_Authenticate|SBI qua vSEPP → N32 → hSEPP|SEPP hai bên lập TLS (N32-c), mã hoá/kiểm toàn vẹn từng IE (PRINS) qua IPX.|SUCI, serving network name (mạng khách)',
 'ausf>udm|Nudm_UEAuthentication_Get|N13 (trong mạng nhà)|',
 'ausf>amf|5G SE AV (HXRES*)|N32|Mạng nhà giữ quyền xác nhận cuối cùng (RES* gửi về AUSF nhà) — chống mạng khách gian lận.|',
 'amf>ue|AUTHENTICATION / SECURITY MODE|NAS 5GMM|',
 'amf>udm|Nudm_UECM_Registration + SDM_Get|N8 qua N32|',
 'amf>ue|REGISTRATION ACCEPT|NAS 5GMM|',
 '#Phiên PDU home-routed',
 'ue>amf|PDU SESSION ESTABLISHMENT REQUEST|NAS 5GSM|',
 'amf>smf|CreateSMContext (V-SMF)|N11|',
 'smf>smfh|Nsmf_PDUSession_Create|N16 qua N32|V-SMF gọi H-SMF; H-SMF cấp IP, lấy chính sách từ PCF nhà và mở cước CHF nhà.|',
 'smfh>pcf|SM Policy (PCF nhà)|N7|',
 'smfh>upfh|PFCP Session Establishment (H-UPF)|N4|',
 'smf>upf|PFCP Session Establishment (V-UPF)|N4|',
 'ue>inet|Dữ liệu (home-routed)|Uu → N3 → V-UPF → N9 (IPX) → H-UPF → N6|Local breakout cũng có (LBO), khi đó chỉ có SMF/UPF khách.|||u',
 '#Cước và đối soát',
 'smfh>chf|N40 (CHF nhà, thời gian thực)|N40|',
 'smf>smf|V-SMF tạo CDR → BCE / TAP|—|GSMA BCE (Billing and Charging Evolution) thay dần TAP cho 5G.|']},
kpi:{g3:['Inbound/outbound roaming attach SR','Gp tunnel SR','MAP SAI/UL SR'],g4:['S6a roaming success','S8 Create Session SR','Roaming VoLTE CSSR'],sa:['N32 transaction SR','Roaming registration SR','N16/N9 session SR']},
err:[['Đăng ký bị từ chối #11/#13','Không có thoả thuận roaming, mạng nhà lái sang mạng khác','Thoả thuận, cờ steering, FPLMN trên SIM'],['Có sóng, không có dữ liệu','Cấm roaming dữ liệu trong hồ sơ, DNS GRX/IPX lỗi, firewall GTP chặn','ULA/ISD, DNS .gprs/.3gppnetwork.org, GTP firewall'],['Gọi VoLTE roaming không được','Đối tác chưa mở S8HR/QCI 1, IMS APN không cho phép','Thoả thuận VoLTE roaming (IR.65), cấu hình APN ims'],['5G SA roaming lỗi','N32 chưa lập, chứng chỉ TLS/PRINS sai','Log SEPP, cấu hình N32-c/N32-f']],
tab:[['rm','Roaming'],['fw','Tường lửa'],['core','Mạng lõi']],
ref:{g3:'GSMA IR.33 (GPRS roaming), IR.34, TD.57',g4:'GSMA IR.88 (LTE roaming), IR.65 (VoLTE S8HR), TS 29.272',nsa:'GSMA IR.88, NG.113',sa:'TS 33.501 mục 13 (SEPP), 29.573 (N32), GSMA NG.113'},
t:{g3:'Đăng ký 2–5 s (qua SS7 quốc tế)',g4:'Thêm 50–300 ms trễ RTT (home-routed)',nsa:'Như 4G',sa:'Thêm 50–300 ms trễ RTT (home-routed)'}});

E2S.push({id:'off',g:'Cước, SMS, roaming, tắt máy',n:'Tắt máy (Detach / Deregistration)',
d:'Tắt máy chủ động: UE báo mạng trước khi tắt nguồn để mạng xoá phiên, đóng cước và không tìm gọi vô ích. Nếu tắt đột ngột (rút pin), mạng chỉ biết khi hết bộ đếm định kỳ.',
f:{
g3:['#Kết nối RRC',...e2R3('detach').slice(0,1),
 '#Tách miền gói',
 'ue>sgsn|DETACH REQUEST (power switched off)|NAS GMM|Kiểu tắt máy: mạng không cần trả lời.|Detach type: switch off, P-TMSI',
 'sgsn>ggsn|DELETE PDP CONTEXT REQUEST|Gn (GTPv1-C)|',
 'ggsn>ocs|CCR-Terminate|Gy|Đóng cước, trả lại hạn mức chưa dùng.|',
 'ggsn>pcrf|CCR-Terminate|Gx|',
 'ggsn>sgsn|DELETE PDP CONTEXT RESPONSE|Gn|',
 '#Tách miền mạch',
 'ue>msc|IMSI DETACH INDICATION|NAS MM|VLR đánh dấu “đã tách”: cuộc gọi đến chuyển hộp thư thoại ngay, không tìm gọi.|',
 'sgsn>hlr|MAP PURGE MS (tuỳ chọn)|Gr|',
 'rnc>ue|RRC CONNECTION RELEASE|Uu|'],
g4:n=>['#Huỷ đăng ký IMS',
 'ue>scscf|SIP REGISTER (Expires: 0)|Gm → Mw|Để cuộc gọi đến chuyển hướng ngay (ví dụ sang hộp thư) thay vì chờ hết hạn đăng ký.|||s',
 'scscf>hss|Cx SAR (USER_DEREGISTRATION)|Cx|',
 '#Tách khỏi EPS',
 'ue>mme|DETACH REQUEST (switch off)|NAS EMM|',
 'mme>sgw|Delete Session Request|S11|Xoá mọi PDN connection.|',
 'sgw>pgw|Delete Session Request|S5|',
 'pgw>pcrf|CCR-Terminate|Gx|',
 'pgw>ocs|CCR-Terminate|Gy|',
 'pgw>sgw|Delete Session Response|S5|',
 'sgw>mme|Delete Session Response|S11|',
 'mme>msc|SGsAP-IMSI-DETACH-INDICATION|SGs|Nếu đã attach kết hợp.|',
 'mme>hss|Purge-UE-Request (tuỳ chọn)|S6a|',
 'mme>enb|UE CONTEXT RELEASE COMMAND|S1-MME|'],
sa:['#Huỷ đăng ký IMS',
 'ue>scscf|SIP REGISTER (Expires: 0)|Gm → Mw|||s',
 '#Huỷ đăng ký 5GS',
 'ue>amf|DEREGISTRATION REQUEST (UE originating, switch off)|NAS 5GMM||De-registration type: switch off, access type 3GPP',
 'amf>smf|Nsmf_PDUSession_ReleaseSMContext|N11|Cho từng phiên PDU.|',
 'smf>upf|PFCP SESSION DELETION REQUEST|N4|UPF trả báo cáo dùng cuối cùng (usage report).|',
 'smf>chf|Nchf_ConvergedCharging_Release|N40|',
 'smf>pcf|Npcf_SMPolicyControl_Delete|N7|',
 'smf>udm|Nudm_UECM_Deregistration (SMF)|N10|',
 'amf>pcf|Npcf_AMPolicyControl_Delete|N15|',
 'amf>udm|Nudm_UECM_Deregistration + SDM Unsubscribe|N8|',
 'amf>gnb|NGAP UE CONTEXT RELEASE COMMAND|N2|',
 'gnb>amf|UE CONTEXT RELEASE COMPLETE|N2|']},
kpi:{g3:['Số thuê bao attached (SAU)','Implicit detach count'],g4:['Attached users (SAU)','Detach rate','Implicit detach'],sa:['Registered users','Deregistration count']},
err:[['Gọi đến vẫn đổ chuông chờ dù máy đã tắt','Tắt đột ngột (không có Detach), IMS chưa hết hạn đăng ký','Thời hạn REGISTER, mobile reachable timer'],['Cước bị treo sau khi tắt','CCR-T không gửi được (lỗi Gy/N40)','Diameter/SBI log, phiên mồ côi ở OCS/CHF']],
tab:[['core','Mạng lõi'],['ims','IMS'],['kpi','KPI']],
ref:{g3:'TS 24.008 mục 4.7.4',g4:'TS 23.401 mục 5.3.8, 24.301 mục 5.5.2',nsa:'Như 4G',sa:'TS 23.502 mục 4.2.2.3, 24.501 mục 5.5.2'},
t:{g3:'< 1 s',g4:'< 0,5 s',nsa:'Như 4G',sa:'< 0,5 s'}});
/* ===== Giao diện thẻ E2E ===== */
const E2W={'SGs/Sv':3,'S3':3,'S3/Gn':3,'N26':3,'I2':3,'S4':3,'S5-C':2,'S5-U':2,'S6a':1};
const e2E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const E2A={i:0,play:false,raf:0,t0:0,spd:1,auto:false,key:''};
function e2Sc(){return E2S.find(s=>s.id===S.e2Sc)||E2S[0];}
function e2Flow(sc,tk){
  let raw=sc.f[tk],note='';
  if(!raw&&tk==='nsa'&&sc.f.g4){raw=sc.f.g4;note=(sc.note&&sc.note.nsa)||'5G NSA dùng lõi EPC và chân LTE cho báo hiệu, nên luồng này giống 4G; NR chỉ là nút phụ mang dữ liệu.';}
  else if(sc.note&&sc.note[tk])note=sc.note[tk];
  if(!raw)return{st:[],na:(sc.na&&sc.na[tk])||'Kịch bản này không áp dụng cho công nghệ đã chọn.',note};
  if(typeof raw==='function')raw=raw(tk==='nsa');
  const st=[];let ph='';
  for(const x of raw){if(x[0]==='#'){ph=x.slice(1);continue;}
    const a=x.split('|'),ft=a[0].split('>');
    let pl=a[6]||'',tm=a[5]||'';if(!pl&&(tm==='u'||tm==='s')){pl=tm;tm='';}
    st.push({f:ft[0],t:ft[1],m:a[1]||'',i:a[2]||'',d:a[3]||'',ie:a[4]||'',tm,p:pl,r:a[7]?a[7].split(','):null,ph});}
  return{st,note};
}
function e2Graph(sc,tk,st){
  const P=Object.assign({},E2P[tk],(sc.pos&&sc.pos[tk])||{});
  const rm=new Set(((sc.rm&&sc.rm[tk])||[]));
  const L=E2L[tk].filter(l=>!rm.has(l[0]+'|'+l[1])&&!rm.has(l[1]+'|'+l[0])).concat((sc.lk&&sc.lk[tk])||[]);
  const used=new Set([...(sc.use&&sc.use[tk]||[])]);st.forEach(s=>{used.add(s.f);used.add(s.t);});
  const opt=id=>P[id]&&P[id][2]===1&&!used.has(id);
  const adj={};L.forEach((l,k)=>{if(!P[l[0]]||!P[l[1]])return;(adj[l[0]]=adj[l[0]]||[]).push([l[1],k]);(adj[l[1]]=adj[l[1]]||[]).push([l[0],k]);});
  const route=(a,b,pl)=>{if(a===b)return{n:[a],l:[]};
    const ok=l=>pl==='u'?l[3].includes('u'):l[3].includes('c');
    const D={[a]:0},prev={},Q=new Set([a]),seen=new Set();
    while(Q.size){let u=null;Q.forEach(q=>{if(u===null||D[q]<D[u])u=q;});Q.delete(u);if(u===b)break;seen.add(u);
      for(const [v,k] of adj[u]||[]){if(seen.has(v)||!ok(L[k]))continue;const w=(E2W[L[k][2]]||1)+(opt(v)?6:0);const nd=D[u]+w;if(D[v]===undefined||nd<D[v]){D[v]=nd;prev[v]=[u,k];Q.add(v);}}}
    if(D[b]===undefined)return pl==='u'?route(a,b,'c'):{n:[a,b],l:[-1]};
    const n=[b],ls=[];let c=b;while(c!==a){const [u,k]=prev[c];ls.unshift(k);n.unshift(u);c=u;}return{n,l:ls};};
  const lk=(a,b)=>L.findIndex(l=>(l[0]===a&&l[1]===b)||(l[0]===b&&l[1]===a));
  st.forEach(s=>{if(s.r){const n=s.r,ls=[];for(let j=1;j<n.length;j++)ls.push(lk(n[j-1],n[j]));s.path={n,l:ls};}else s.path=route(s.f,s.t,s.p?'u':'c');});
  const vis=new Set(Object.keys(P).filter(id=>P[id][2]!==1));st.forEach(s=>s.path.n.forEach(n=>vis.add(n)));
  const lab=id=>(sc.lab&&sc.lab[tk]&&sc.lab[tk][id])||(E2N[id]||[id])[0];
  return{P,L,vis,lab};
}
function e2Cur(){
  const sc=e2Sc(),tk=S.e2R,key=sc.id+'|'+tk;
  if(E2A.key!==key){E2A.key=key;const fl=e2Flow(sc,tk);E2A.fl=fl;E2A.g=e2Graph(sc,tk,fl.st);E2A.i=Math.min(E2A.i,Math.max(0,fl.st.length-1));}
  return{sc,tk,fl:E2A.fl,g:E2A.g};
}
const e2Col=p=>p==='s'?'var(--sip)':p==='u'?'var(--up)':'var(--cp)';
function e2Net(){
  const {fl,g}=e2Cur(),s=fl.st[E2A.i];
  const onL=new Set(s?s.path.l:[]),onN=new Set(s?s.path.n:[]);
  let h='';
  g.L.forEach((l,k)=>{if(!g.vis.has(l[0])||!g.vis.has(l[1]))return;const a=g.P[l[0]],b=g.P[l[1]];const on=onL.has(k);
    const pl=l[3]==='c'?'c':l[3]==='u'?'u':'cu';
    h+=`<line class="e2ln ${pl}${on?' on':''}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"${on?` style="stroke:${e2Col(s.p)}"`:''}/>`;});
  g.L.forEach((l,k)=>{if(!g.vis.has(l[0])||!g.vis.has(l[1]))return;const a=g.P[l[0]],b=g.P[l[1]];const on=onL.has(k);const x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;
    h+=`<text class="e2if${on?' on':''}" x="${x}" y="${y+3.5}" text-anchor="middle">${e2E(l[2])}</text>`;});
  [...g.vis].forEach(id=>{const p=g.P[id];if(!p)return;const on=onN.has(id),end=s&&(id===s.f||id===s.t),lb=g.lab(id),w=Math.max(70,Math.min(132,lb.length*6.6+16));
    h+=`<g class="e2nd${on?' on':''}${end?' end':''}" data-e2n="${id}" tabindex="0" role="button" aria-label="${e2E(lb)}"><rect x="${p[0]-w/2}" y="${p[1]-15}" width="${w}" height="30" rx="7"/><text x="${p[0]}" y="${p[1]+4.5}" text-anchor="middle">${e2E(lb)}</text><title>${e2E((E2N[id]||['',''])[1])}</title></g>`;});
  h+=`<circle id="e2dot" r="7" cx="-20" cy="-20" style="fill:${s?e2Col(s.p):'none'}"/>`;
  const ys=[...g.vis].map(id=>g.P[id]&&g.P[id][1]).filter(v=>v!=null),y0=Math.max(0,Math.min(...ys)-26),y1=Math.min(440,Math.max(...ys)+26);
  $('#e2Net').innerHTML=`<svg viewBox="0 ${y0} 1000 ${y1-y0}" class="e2svg" role="img" aria-label="Sơ đồ mạng ${E2T[S.e2R]}">${h}</svg>`;
}
function e2Pt(path,P,u){/* vị trí trên đường gấp khúc theo tỉ lệ u */
  const pts=path.n.map(n=>P[n]).filter(Boolean);if(pts.length<2)return pts[0]||[-20,-20];
  let tot=0;const seg=[];for(let j=1;j<pts.length;j++){const d=Math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]);seg.push(d);tot+=d;}
  let r=u*tot;for(let j=0;j<seg.length;j++){if(r<=seg[j]||j===seg.length-1){const q=seg[j]?Math.min(1,r/seg[j]):1;return[pts[j][0]+(pts[j+1][0]-pts[j][0])*q,pts[j][1]+(pts[j+1][1]-pts[j][1])*q];}r-=seg[j];}
  return pts[pts.length-1];
}
function e2Lad(){
  const {fl,g}=e2Cur();const st=fl.st;if(!st.length){$('#e2Lad').innerHTML='';return;}
  const ids=[...new Set(st.flatMap(s=>[s.f,s.t]))].sort((a,b)=>(g.P[a][0]-g.P[b][0])||(g.P[a][1]-g.P[b][1]));
  const DX=150,X0=70,W=Math.max(640,X0*2+DX*(ids.length-1)),x=id=>X0+ids.indexOf(id)*DX;
  let y=10,h='',ph='',rows=[];
  st.forEach((s,k)=>{if(s.ph!==ph){ph=s.ph;y+=6;h+=`<text class="e2ph" x="6" y="${y+12}">${e2E(ph)}</text><line class="e2phl" x1="0" x2="${W}" y1="${y+17}" y2="${y+17}"/>`;y+=24;}
    rows.push([k,y]);y+=30;});
  const H=y+10;
  let lanes=ids.map(id=>`<line class="e2lane" x1="${x(id)}" x2="${x(id)}" y1="0" y2="${H}"/>`).join('');
  let msg='';
  rows.forEach(([k,yy])=>{const s=st[k],xa=x(s.f),xb=x(s.t),c=e2Col(s.p),cur=k===E2A.i?' cur':'';
    if(s.f===s.t){const t=s.m.length>48?s.m.slice(0,46)+'…':s.m;
      msg+=`<g class="e2r${cur}" data-e2s="${k}" tabindex="0" role="button"><rect class="e2hit" x="0" y="${yy-2}" width="${W}" height="28"/><rect class="e2self" x="${xa-8}" y="${yy+4}" width="16" height="16" rx="3" style="stroke:${c}"/><text class="e2m" x="${xa+14}" y="${yy+16}">${k+1}. ${e2E(t)}</text><title>${e2E(s.m)}</title></g>`;return;}
    const span=Math.abs(xb-xa),dir=xb>xa?1:-1,len=Math.max(30,Math.floor((Math.max(span,250)-14)/7.4)),t=(k+1)+'. '+s.m,tt=t.length>len?t.slice(0,len-1)+'…':t;
    const ya=yy+18,ax=xb-dir*2;
    msg+=`<g class="e2r${cur}" data-e2s="${k}" tabindex="0" role="button"><rect class="e2hit" x="0" y="${yy-2}" width="${W}" height="28"/><line class="e2ar" x1="${xa}" y1="${ya}" x2="${ax}" y2="${ya}" style="stroke:${c}"${s.p==='u'?' stroke-dasharray="6 3"':''}/><path d="M${ax} ${ya} l${-dir*8} -4.5 v9 z" style="fill:${c}"/><text class="e2m" x="${Math.min(xa,xb)+6}" y="${yy+11}">${e2E(tt)}</text><title>${e2E(s.m+' — '+s.i)}</title></g>`;});
  const hd=ids.map(id=>`<span style="left:${x(id)}px">${e2E(g.lab(id))}</span>`).join('');
  $('#e2Lad').innerHTML=`<div class="e2lh" style="width:${W}px">${hd}</div><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" class="e2lsv">${lanes}${h}${msg}</svg>`;
  E2A.rows=rows;
}
function e2LadMark(){
  $$('#e2Lad .e2r').forEach(r=>r.classList.toggle('cur',+r.dataset.e2s===E2A.i));
  const box=$('#e2Lad'),r=(E2A.rows||[]).find(z=>z[0]===E2A.i);if(!box||!r)return;
  const top=r[1]+34,vh=box.clientHeight;if(top<box.scrollTop+40||top>box.scrollTop+vh-40)box.scrollTo({top:Math.max(0,top-vh/2)});
}
function e2Info(){
  const {sc,tk,fl,g}=e2Cur(),s=fl.st[E2A.i];
  if(!s){$('#e2Info').innerHTML=`<h3>Không áp dụng</h3><p>${e2E(fl.na)}</p>`;return;}
  const n=fl.st.length,ifs=s.path.l.filter(k=>k>=0).map(k=>g.L[k][2]);
  $('#e2Info').innerHTML=`<p class="e2step">Bước ${E2A.i+1}/${n} · ${e2E(s.ph)}</p>
  <h3 class="e2msg" style="border-color:${e2Col(s.p)}">${e2E(s.m)}</h3>
  <dl class="kv e2kv"><dt>Từ → tới</dt><dd>${e2E(g.lab(s.f))} → ${e2E(g.lab(s.t))}</dd>
  <dt>Giao diện, giao thức</dt><dd>${e2E(s.i||'—')}</dd>
  ${ifs.length>1?`<dt>Đi qua</dt><dd>${s.path.n.map(x=>e2E(g.lab(x))).join(' → ')}</dd>`:''}
  <dt>Mặt phẳng</dt><dd>${s.p==='u'?'Người dùng (dữ liệu)':s.p==='s'?'Báo hiệu SIP (đi trên mặt phẳng người dùng)':'Điều khiển (báo hiệu)'}</dd></dl>
  ${s.d?`<p class="e2d">${e2E(s.d)}</p>`:''}
  ${s.ie?`<p class="e2x"><b>IE chính:</b> ${e2E(s.ie)}</p>`:''}
  ${s.tm?`<p class="e2x"><b>Bộ đếm, tham số:</b> ${e2E(s.tm)}</p>`:''}
  ${fl.note?`<p class="note e2nt">${e2E(fl.note)}</p>`:''}`;
}
function e2Out(){
  const {sc,tk,fl,g}=e2Cur(),st=fl.st;
  const ifs=new Set();st.forEach(s=>s.path.l.forEach(k=>{if(k>=0)ifs.add(g.L[k][2]);}));
  const nodes=new Set(st.flatMap(s=>[s.f,s.t]));
  const rf=(sc.ref&&(sc.ref[tk]||(tk==='nsa'&&sc.ref.g4)))||'—',tt=(sc.t&&(sc.t[tk]||(tk==='nsa'&&sc.t.g4)))||'—';
  $('#e2Out').innerHTML=`<dt>Công nghệ</dt><dd>${E2T[tk]}</dd><dt>Số bản tin, bước</dt><dd>${st.length}</dd><dt>Số nút tham gia</dt><dd>${nodes.size}</dd><dt>Số pha</dt><dd>${new Set(st.map(s=>s.ph)).size}</dd><dt>Thời gian điển hình (ước lượng)</dt><dd>${e2E(tt)}</dd><div class="sep"></div><dt>Giao diện đi qua</dt><dd class="e2wrap">${[...ifs].map(e2E).join(', ')||'—'}</dd><dt>Tài liệu 3GPP/GSMA</dt><dd class="e2wrap">${e2E(rf)}</dd>`;
}
function e2Kpi(){
  const {sc,tk}=e2Cur();const k=(sc.kpi&&(sc.kpi[tk]||(tk==='nsa'&&sc.kpi.g4)))||[];
  $('#e2Kpi').innerHTML=`<h3>KPI theo dõi, lỗi thường gặp và nơi xem chi tiết</h3>
  <p class="e2x"><b>KPI liên quan (${E2T[tk]}):</b> ${k.length?k.map(x=>`<span class="chip">${e2E(x)}</span>`).join(' '):'—'}</p>
  <div class="scroll"><table class="e2tb"><thead><tr><th>Triệu chứng</th><th>Nguyên nhân hay gặp</th><th>Kiểm tra ở đâu</th></tr></thead><tbody>${(sc.err||[]).map(r=>`<tr><td>${e2E(r[0])}</td><td>${e2E(r[1])}</td><td>${e2E(r[2])}</td></tr>`).join('')}</tbody></table></div>
  <p class="e2x" style="margin-top:10px"><b>Xem chi tiết ở thẻ khác:</b></p><div class="e2go">${(sc.tab||[]).map(t=>`<button type="button" class="btn sm" data-e2go="${t[0]}">${e2E(t[1])} →</button>`).join('')}</div>`;
}
function e2Cmp(){
  const sc=e2Sc(),F={},order=[];
  const pos={};E2TK.forEach(tk=>{const fl=e2Flow(sc,tk);F[tk]=fl;const n=fl.st.length;fl.st.forEach((s,i)=>{if(!order.includes(s.ph))order.push(s.ph);(pos[s.ph]=pos[s.ph]||[]).push(i/n);});});
  const av=ph=>{const a=pos[ph];a.sort((x,y)=>x-y);return a[0]+a[a.length-1];};order.sort((a,b)=>av(a)-av(b));
  const cell=(tk,ph)=>{const fl=F[tk];if(!fl.st.length)return'<td class="e2na">—</td>';const ss=fl.st.filter(s=>s.ph===ph);if(!ss.length)return'<td class="e2na">—</td>';
    const ms=ss.map(s=>s.m.split(/ [(+—]/)[0]).filter((v,i,a)=>a.indexOf(v)===i);const show=ms.slice(0,5).map(e2E).join(' → ')+(ms.length>5?` … (+${ms.length-5})`:'');
    const ifs=[...new Set(ss.map(s=>s.i.split(' (')[0]).filter(Boolean))].slice(0,4);
    return`<td${tk===S.e2R?' class="e2cur"':''}>${show}<div class="e2ifc">${ifs.map(e2E).join(' · ')}</div></td>`;};
  $('#e2CmpT').textContent='So sánh 3G / 4G / 5G NSA / 5G SA: '+sc.n;
  $('#e2Cmp').innerHTML=`<thead><tr><th>Pha</th>${E2TK.map(tk=>`<th${tk===S.e2R?' class="e2cur"':''}>${E2T[tk]}</th>`).join('')}</tr></thead><tbody>${order.map(ph=>`<tr><th scope="row">${e2E(ph)}</th>${E2TK.map(tk=>cell(tk,ph)).join('')}</tr>`).join('')}
  <tr><th scope="row">Số bước</th>${E2TK.map(tk=>`<td${tk===S.e2R?' class="e2cur"':''}>${F[tk].st.length||'—'}</td>`).join('')}</tr>
  <tr><th scope="row">Thời gian điển hình</th>${E2TK.map(tk=>`<td${tk===S.e2R?' class="e2cur"':''}>${e2E((sc.t&&(sc.t[tk]||(tk==='nsa'&&sc.t.g4)))||'—')}</td>`).join('')}</tr></tbody>`;
}
const E2MAP=[['Trạm vô tuyến','NodeB + RNC','eNodeB','eNodeB (MeNB) + en-gNB (SgNB)','gNodeB (CU-CP, CU-UP, DU, RU)'],
['RRC kết thúc ở','RNC','eNodeB','eNodeB (RRC NR bọc trong RRC LTE; SRB3 tuỳ chọn ở gNB)','gNodeB (CU-CP)'],
['Mã hoá vô tuyến kết thúc ở','RNC (UEA/UIA)','eNodeB (EEA/EIA, PDCP)','eNodeB và gNB (PDCP theo bearer)','gNB-CU (NEA/NIA, toàn vẹn cả mặt phẳng người dùng)'],
['Trạng thái RRC','Idle, CELL_DCH, CELL_FACH, CELL_PCH, URA_PCH','Idle, Connected','Idle, Connected (+ SCG khi có NR)','Idle, Inactive, Connected'],
['Quản lý di động, NAS','SGSN (PS: GMM), MSC/VLR (CS: MM)','MME (EMM, ESM)','MME','AMF (5GMM); 5GSM tới SMF'],
['Phiên dữ liệu','PDP context (SGSN + GGSN)','EPS bearer (MME, SGW, PGW), luôn có bearer mặc định','Như 4G; bearer có thể là split/SCG bearer','PDU session (SMF điều khiển UPF qua PFCP)'],
['Cổng ra mạng ngoài','GGSN (Gi)','PGW (SGi)','PGW (SGi)','UPF (N6)'],
['Đơn vị QoS','Traffic class (conversational, streaming, interactive, background)','EPS bearer, QCI 1–9 (+ mở rộng)','EPS bearer, QCI','QoS flow, 5QI (QFI trong header GTP-U)'],
['Dữ liệu thuê bao','HLR/AuC','HSS','HSS','UDM/UDR + AUSF'],
['Xác thực','UMTS AKA (hai chiều)','EPS-AKA (KASME gắn mạng phục vụ)','EPS-AKA','5G-AKA hoặc EAP-AKA′; SUCI giấu IMSI'],
['Chính sách','PCRF qua Gx (tuỳ chọn)','PCRF (Gx, Rx, Sy)','PCRF','PCF (N7, N15, N5, N28)'],
['Tính cước','OCS (Gy, CAP/CAMEL), CGF (Ga)','OCS (Gy, Ro), OFCS (Gz)','Như 4G + báo cáo lưu lượng NR (Secondary RAT usage)','CHF hội tụ (N40), CDR qua Bx'],
['Thoại','CS qua MSC/MGW','VoLTE qua IMS; dự phòng CSFB','VoLTE trên chân LTE','VoNR qua IMS; dự phòng EPS fallback'],
['SMS','MSC (CS) hoặc SGSN','SGs về MSC, hoặc SMS over IMS','Như 4G','SMSF (SMS over NAS) hoặc SMS over IMS'],
['Giao diện trạm – lõi','Iub + Iu-CS / Iu-PS','S1-MME, S1-U','S1-MME (eNB), S1-U tới gNB (option 3x)','N2, N3'],
['Giao diện giữa các trạm','Iur','X2','X2 (eNB–gNB, gNB–gNB)','Xn'],
['Giao thức báo hiệu lõi','MAP/SS7 (SIGTRAN), GTPv1','Diameter, GTPv2-C','Diameter, GTPv2-C','SBI HTTP/2 + JSON, PFCP, NGAP'],
['Định danh tạm','TMSI, P-TMSI','GUTI, S-TMSI','GUTI','5G-GUTI, 5G-S-TMSI, I-RNTI (Inactive)'],
['Vùng định vị','LA (CS), RA (PS)','TA, danh sách TAI','TA','TA, danh sách TAI; RNA khi Inactive'],
['Chuyển giao trong cùng công nghệ','Mềm (nhiều NodeB cùng lúc)','Cứng qua X2 hoặc S1','Đổi PSCell/SgNB; LTE theo X2','Cứng qua Xn hoặc N2; CHO, DAPS (5G-Advanced)'],
['Roaming','Gp qua GRX, MAP qua SCCP GT','S8 + S6a qua IPX (DEA)','Như 4G','N32 (SEPP), N9, N16; SUCI']];
function e2Map(){
  $('#e2Map').innerHTML=`<thead><tr><th>Chức năng</th>${E2TK.map(tk=>`<th${tk===S.e2R?' class="e2cur"':''}>${E2T[tk]}</th>`).join('')}</tr></thead><tbody>${E2MAP.map(r=>`<tr><th scope="row">${e2E(r[0])}</th>${r.slice(1).map((c,j)=>`<td${E2TK[j]===S.e2R?' class="e2cur"':''}>${e2E(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
}
function e2Ctl(){
  const gs=[...new Set(E2S.map(s=>s.g))];
  $('#e2Ctl').innerHTML=`<div class="e2row"><span class="e2lb">Công nghệ</span><div class="seg" role="group" aria-label="Chọn công nghệ">${E2TK.map(tk=>`<button type="button" data-e2t="${tk}" aria-pressed="${tk===S.e2R}">${E2T[tk]}</button>`).join('')}</div></div>
  <div class="e2row"><label class="e2lb" for="e2Sel">Kịch bản</label><select id="e2Sel">${gs.map(g=>`<optgroup label="${e2E(g)}">${E2S.filter(s=>s.g===g).map(s=>`<option value="${s.id}"${s.id===S.e2Sc?' selected':''}>${e2E(s.n)}</option>`).join('')}</optgroup>`).join('')}</select></div>
  <div class="e2row e2pb"><button type="button" class="btn sm" data-e2a="first" aria-label="Về bước đầu">⏮</button><button type="button" class="btn sm" data-e2a="prev" aria-label="Bước trước">◀ Lùi</button><button type="button" class="btn sm pri" data-e2a="play" id="e2Play">${E2A.play?'❚❚ Dừng':'▶ Chạy'}</button><button type="button" class="btn sm" data-e2a="next" aria-label="Bước sau">Tới ▶</button><label class="e2lb" for="e2Spd">Tốc độ</label><select id="e2Spd" style="width:auto">${[0.5,1,2,3].map(v=>`<option value="${v}"${v===E2A.spd?' selected':''}>${String(v).replace('.',',')}×</option>`).join('')}</select></div>
  <p class="hint" id="e2Desc" style="margin:8px 0 0"></p>`;
}
function renderE2(){
  if(!S.e2Sc)S.e2Sc='reg';
  if(S.e2M!==S.mode){S.e2M=S.mode;S.e2R={SA:'sa',NSA:'nsa',LTE:'g4'}[S.mode]||'sa';E2A.i=0;}
  e2Ctl();const sc=e2Sc();e2Cur();
  $('#e2Desc').textContent=sc.d;
  e2Net();e2Lad();e2Info();e2Out();e2Kpi();e2Cmp();e2Map();e2LadMark();
  if(S.tab!=='e2')e2Stop();else e2Dot(1);
}
function e2Dot(u){const {fl,g}=e2Cur(),s=fl.st[E2A.i],d=$('#e2dot');if(!d||!s)return;const p=u>=1?[-20,-20]:e2Pt(s.path,g.P,u);d.setAttribute('cx',p[0]);d.setAttribute('cy',p[1]);}
function e2Stop(){E2A.play=false;E2A.auto=false;if(E2A.raf)cancelAnimationFrame(E2A.raf);E2A.raf=0;const b=$('#e2Play');if(b)b.textContent='▶ Chạy';}
function e2Step(i,anim){
  const {fl}=e2Cur();if(!fl.st.length)return;E2A.i=Math.max(0,Math.min(fl.st.length-1,i));
  e2Net();e2Info();e2LadMark();
  if(anim&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){E2A.t0=performance.now();if(!E2A.raf)E2A.raf=requestAnimationFrame(e2Loop);}else e2Dot(1);
}
function e2Loop(now){
  E2A.raf=0;if(S.tab!=='e2'||document.hidden){e2Stop();return;}
  const mv=900/E2A.spd,hold=550/E2A.spd,el=now-E2A.t0;e2Dot(Math.min(1,el/mv));
  if(el<mv){E2A.raf=requestAnimationFrame(e2Loop);return;}
  if(E2A.play){if(el<mv+hold){E2A.raf=requestAnimationFrame(e2Loop);return;}
    const {fl}=e2Cur();if(E2A.i>=fl.st.length-1){e2Stop();return;}e2Step(E2A.i+1,true);}
}
document.addEventListener('click',e=>{
  const t=e.target.closest('#t-e2 [data-e2t],#t-e2 [data-e2a],#t-e2 [data-e2s],#t-e2 [data-e2go],#t-e2 [data-e2n]');if(!t)return;const d=t.dataset;
  if(d.e2t){e2Stop();const m={g4:'LTE',nsa:'NSA',sa:'SA'}[d.e2t];S.e2R=d.e2t;E2A.i=0;
    if(m&&m!==S.mode){switchMode(m);S.e2M=m;try{stopSig();}catch(x){}renderAll();}else renderE2();}
  else if(d.e2a){const {fl}=e2Cur();
    if(d.e2a==='play'){if(E2A.play){e2Stop();return;}if(!fl.st.length)return;if(E2A.i>=fl.st.length-1)E2A.i=0;E2A.play=true;$('#e2Play').textContent='❚❚ Dừng';e2Step(E2A.i,true);}
    else{e2Stop();e2Step(d.e2a==='first'?0:d.e2a==='prev'?E2A.i-1:E2A.i+1,true);}}
  else if(d.e2s!==undefined){e2Stop();e2Step(+d.e2s,true);}
  else if(d.e2go){e2Stop();const m={g4:'LTE',nsa:'NSA',sa:'SA'}[S.e2R];if(m&&m!==S.mode){switchMode(m);S.e2M=m;}S.tab=d.e2go;try{stopSig();stopPlay();}catch(x){}renderAll();window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});}
  else if(d.e2n){const id=d.e2n,{g}=e2Cur(),i=E2N[id]||[id,''];$('#e2Info').innerHTML=`<p class="e2step">Nút mạng</p><h3 class="e2msg">${e2E(g.lab(id))}</h3><p class="e2d">${e2E(i[1])}</p><p class="note">Bấm một bản tin ở sơ đồ tuần tự hoặc nút Tới để quay lại các bước.</p>`;}
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('#t-e2 [data-e2s],#t-e2 [data-e2n]')){e.preventDefault();e.target.closest('[data-e2s],[data-e2n]').dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
document.addEventListener('change',e=>{
  if(e.target.id==='e2Sel'){e2Stop();S.e2Sc=e.target.value;E2A.i=0;renderE2();}
  else if(e.target.id==='e2Spd'){E2A.spd=+e.target.value;}
});
RENDER.e2=renderE2;
/* đưa mọi bước của các kịch bản vào ô tìm kiếm chung */
if(typeof qSnap==='function'){const _qs=qSnap;qSnap=function(){_qs.apply(this,arguments);if(!QS||!QS.I||QS.e2)return;QS.e2=1;
  for(const sc of E2S)for(const tk of E2TK){if(tk==='nsa'&&!sc.f.nsa&&typeof sc.f.g4!=='function')continue;const fl=e2Flow(sc,tk);
    fl.st.forEach((s,i)=>qAdd(QS.I,'Toàn trình E2E · '+E2T[tk]+' · '+sc.n,s.m,[s.ph,s.d,s.i,s.ie,s.tm].join('. '),2,()=>{S.tab='e2';S.e2Sc=sc.id;S.e2R=tk;S.e2M=S.mode;E2A.key='';E2A.i=i;},'#e2Info'));
    qAdd(QS.I,'Toàn trình E2E',sc.n+' · '+E2T[tk],sc.d,3,()=>{S.tab='e2';S.e2Sc=sc.id;S.e2R=tk;S.e2M=S.mode;E2A.key='';E2A.i=0;},'#e2Ctl');}
  E2MAP.forEach(r=>qAdd(QS.I,'Toàn trình E2E · Nút tương ứng 3G/4G/5G',r[0],r.slice(1).join('. '),2,()=>{S.tab='e2';},'#e2Map'));};}
