
/* ===== Thuật ngữ: liên kết từ viết tắt, thẻ chi tiết khi di chuột hoặc chạm (hình khối, chức năng, callflow chạy animation) ===== */
(function(){
if(window.__GL)return;window.__GL=1;
var RAW=`UE|User Equipment|Thiết bị người dùng (điện thoại, modem, CPE)
gNB|next-generation NodeB|Trạm gốc 5G NR
eNB|evolved NodeB|Trạm gốc 4G LTE
en-gNB|E-UTRA-NR Dual Connectivity gNB|Trạm gốc NR làm nút phụ trong EN-DC (5G NSA)
ng-eNB|next generation eNB|Trạm gốc LTE nối vào lõi 5G
MeNB|Master eNB|eNB chủ (nút neo điều khiển) trong EN-DC
SgNB|Secondary gNB|gNB phụ trong EN-DC
NG-RAN|Next Generation Radio Access Network|Mạng truy nhập vô tuyến của 5G (gNB và ng-eNB)
E-UTRAN|Evolved Universal Terrestrial Radio Access Network|Mạng truy nhập vô tuyến 4G
UTRAN|UMTS Terrestrial Radio Access Network|Mạng truy nhập vô tuyến 3G
UMTS|Universal Mobile Telecommunications System|Hệ thống viễn thông di động toàn cầu (3G)
GSM|Global System for Mobile Communications|Hệ thống thông tin di động toàn cầu (2G)
WCDMA|Wideband Code Division Multiple Access|Đa truy nhập phân mã băng rộng (vô tuyến 3G)
GPRS|General Packet Radio Service|Dịch vụ vô tuyến gói chung (dữ liệu 2G, 3G)
LTE|Long Term Evolution|Tiến hoá dài hạn (4G)
NR|New Radio|Vô tuyến mới, công nghệ truy nhập của 5G
RAT|Radio Access Technology|Công nghệ truy nhập vô tuyến (2G, 3G, 4G, 5G)
SA|Standalone|5G độc lập: gNB nối thẳng lõi 5GC
NSA|Non-Standalone|5G không độc lập: NR dựa trên neo LTE và lõi EPC
EN-DC|E-UTRA-NR Dual Connectivity|Kết nối kép LTE (chủ) và NR (phụ)
NE-DC|NR-E-UTRA Dual Connectivity|Kết nối kép với nút chủ NR, nút phụ LTE
NR-DC|NR-NR Dual Connectivity|Kết nối kép giữa hai nút NR
MR-DC|Multi-Radio Dual Connectivity|Kết nối kép đa công nghệ vô tuyến
CA|Carrier Aggregation|Ghép sóng mang để tăng tốc độ
PCell|Primary Cell|Cell chính của UE (giữ kết nối điều khiển)
SCell|Secondary Cell|Cell phụ ghép thêm tài nguyên
PSCell|Primary SCG Cell|Cell chính của nhóm cell phụ
SCG|Secondary Cell Group|Nhóm cell phụ
MCG|Master Cell Group|Nhóm cell chủ
RU|Radio Unit|Khối vô tuyến: bộ khuếch đại, đổi tần, anten
AAU|Active Antenna Unit|Anten chủ động tích hợp khối vô tuyến
RRU|Remote Radio Unit|Khối vô tuyến từ xa (4G, nối BBU bằng CPRI)
RRH|Remote Radio Head|Đầu vô tuyến từ xa
BBU|Baseband Unit|Khối xử lý băng gốc
DU|Distributed Unit|Khối phân tán của gNB: RLC, MAC, PHY cao
CU|Central Unit|Khối trung tâm của gNB: RRC, SDAP, PDCP
CU-CP|Central Unit - Control Plane|Phần điều khiển của CU
CU-UP|Central Unit - User Plane|Phần dữ liệu người dùng của CU
gNB-DU|next-generation NodeB Distributed Unit|Khối DU của gNB
gNB-CU-CP|next-generation NodeB Central Unit, Control Plane|Khối CU-CP của gNB
gNB-CU-UP|next-generation NodeB Central Unit, User Plane|Khối CU-UP của gNB
C-RAN|Centralized / Cloud RAN|RAN tập trung hoá xử lý băng gốc
vRAN|virtualized RAN|RAN ảo hoá chạy trên máy chủ thông dụng
O-RAN|Open RAN|RAN mở, giao diện chuẩn hoá giữa các khối
RIC|RAN Intelligent Controller|Bộ điều khiển thông minh của RAN
RAN|Radio Access Network|Mạng truy nhập vô tuyến
CN|Core Network|Mạng lõi
5GC|5G Core|Lõi 5G
EPC|Evolved Packet Core|Lõi gói tiến hoá của 4G
EPS|Evolved Packet System|Hệ thống gói tiến hoá (E-UTRAN cộng EPC)
5GS|5G System|Hệ thống 5G (NG-RAN cộng 5GC)
PLMN|Public Land Mobile Network|Mạng di động mặt đất công cộng, tức một nhà mạng (MCC + MNC)
MCC|Mobile Country Code|Mã quốc gia di động (Việt Nam là 452)
MNC|Mobile Network Code|Mã mạng di động
MOCN|Multi-Operator Core Network|Nhiều nhà mạng dùng chung RAN, mỗi nhà mạng một lõi
MORAN|Multi-Operator RAN|Nhiều nhà mạng dùng chung trạm, mỗi nhà mạng một sóng mang
TAC|Tracking Area Code|Mã vùng theo dõi
TAI|Tracking Area Identity|Định danh vùng theo dõi
TAU|Tracking Area Update|Cập nhật vùng theo dõi
NAS|Non-Access Stratum|Tầng không truy nhập: báo hiệu giữa UE và lõi
RRC|Radio Resource Control|Điều khiển tài nguyên vô tuyến (kết nối, đo, handover)
SDAP|Service Data Adaptation Protocol|Giao thức ánh xạ luồng QoS vào bearer vô tuyến
PDCP|Packet Data Convergence Protocol|Giao thức hội tụ gói dữ liệu: nén tiêu đề, mã hoá, số thứ tự
RLC|Radio Link Control|Điều khiển liên kết vô tuyến: phân đoạn, truyền lại
MAC|Medium Access Control|Điều khiển truy nhập môi trường: lập lịch, HARQ (cũng là Message Authentication Code trong bảo mật)
PHY|Physical layer|Lớp vật lý: mã hoá kênh, điều chế, OFDM
RF|Radio Frequency|Tần số vô tuyến
HARQ|Hybrid Automatic Repeat reQuest|Truyền lại lai: kiểm lỗi, gộp tín hiệu các lần gửi
ARQ|Automatic Repeat reQuest|Tự động yêu cầu truyền lại
ROHC|Robust Header Compression|Nén tiêu đề chắc chắn: IP/UDP/RTP còn vài byte
RoHC|Robust Header Compression|Nén tiêu đề chắc chắn: IP/UDP/RTP còn vài byte
DRB|Data Radio Bearer|Bearer vô tuyến cho dữ liệu người dùng
SRB|Signalling Radio Bearer|Bearer vô tuyến cho báo hiệu
QoS|Quality of Service|Chất lượng dịch vụ
QCI|QoS Class Identifier|Mã lớp QoS của 4G (QCI 1 thoại, 5 báo hiệu IMS, 9 internet)
5QI|5G QoS Identifier|Mã lớp QoS của 5G
QFI|QoS Flow Identifier|Định danh luồng QoS trong phiên PDU
GBR|Guaranteed Bit Rate|Tốc độ bit được bảo đảm
AMBR|Aggregate Maximum Bit Rate|Tổng tốc độ bit tối đa cho UE hoặc phiên
ARP|Allocation and Retention Priority|Mức ưu tiên cấp phát và giữ bearer (trong mạng IP, ARP là Address Resolution Protocol: hỏi MAC theo IP)
PCC|Policy and Charging Control|Kiểm soát chính sách và tính cước
PDR|Packet Detection Rule|Luật nhận diện gói ở UPF
FAR|Forwarding Action Rule|Luật hành động chuyển tiếp ở UPF
QER|QoS Enforcement Rule|Luật thi hành QoS ở UPF
URR|Usage Reporting Rule|Luật báo cáo lưu lượng sử dụng ở UPF
PFCP|Packet Forwarding Control Protocol|Giao thức SMF điều khiển UPF qua N4
TEID|Tunnel Endpoint Identifier|Định danh đầu cuối đường hầm GTP
GTP|GPRS Tunnelling Protocol|Giao thức đường hầm GPRS (GTP-C điều khiển, GTP-U dữ liệu)
GTP-U|GPRS Tunnelling Protocol - User plane|Đường hầm GTP chở gói người dùng (UDP 2152)
GTP-C|GPRS Tunnelling Protocol - Control plane|GTP báo hiệu điều khiển đường hầm
GTPv2|GPRS Tunnelling Protocol version 2|GTP bản 2 cho báo hiệu 4G (UDP 2123)
GTPv2-C|GPRS Tunnelling Protocol version 2 - Control|GTP bản 2 điều khiển: S11, S5, S10, Sv
PDU|Protocol Data Unit|Đơn vị dữ liệu giao thức; phiên PDU là phiên dữ liệu của 5G
PDN|Packet Data Network|Mạng dữ liệu gói (internet, IMS)
PDP|Packet Data Protocol|Giao thức dữ liệu gói (ngữ cảnh PDP của 2G, 3G)
APN|Access Point Name|Tên điểm truy nhập (ví dụ internet, ims)
DNN|Data Network Name|Tên mạng dữ liệu của 5G, tương đương APN
SSC|Session and Service Continuity|Chế độ liên tục phiên và dịch vụ
S-NSSAI|Single Network Slice Selection Assistance Information|Thông tin nhận dạng một lát cắt mạng (SST và SD)
NSSAI|Network Slice Selection Assistance Information|Tập thông tin chọn lát cắt mạng
SST|Slice/Service Type|Loại lát cắt (eMBB, URLLC, MIoT)
eMBB|enhanced Mobile Broadband|Băng rộng di động nâng cao
URLLC|Ultra-Reliable Low-Latency Communications|Truyền thông tin cậy cực cao, trễ cực thấp
mMTC|massive Machine-Type Communications|Truyền thông máy số lượng lớn
IoT|Internet of Things|Internet vạn vật
NB-IoT|Narrowband IoT|IoT băng hẹp
LTE-M|LTE for Machines|LTE cho thiết bị máy (eMTC)
IMSI|International Mobile Subscriber Identity|Số nhận dạng thuê bao di động quốc tế (lưu trong SIM)
SUPI|Subscription Permanent Identifier|Định danh thuê bao cố định của 5G
SUCI|Subscription Concealed Identifier|Định danh thuê bao đã che (mã hoá SUPI)
GUTI|Globally Unique Temporary Identifier|Định danh tạm toàn cục duy nhất
TMSI|Temporary Mobile Subscriber Identity|Định danh tạm của thuê bao di động
S-TMSI|SAE Temporary Mobile Subscriber Identity|Định danh tạm rút gọn dùng khi tìm gọi
IMEI|International Mobile Equipment Identity|Số nhận dạng máy di động quốc tế
IMEISV|IMEI and Software Version|IMEI kèm phiên bản phần mềm
PEI|Permanent Equipment Identifier|Định danh thiết bị cố định của 5G (thường là IMEI)
MSISDN|Mobile Station International Subscriber Directory Number|Số điện thoại của thuê bao
MSRN|Mobile Station Roaming Number|Số tạm dùng định tuyến cuộc gọi tới thuê bao roaming
IMPI|IP Multimedia Private Identity|Định danh riêng của thuê bao IMS (dùng xác thực)
IMPU|IP Multimedia Public Identity|Định danh công khai của thuê bao IMS (sip: hoặc tel:)
SIM|Subscriber Identity Module|Thẻ nhận dạng thuê bao
USIM|Universal Subscriber Identity Module|Ứng dụng SIM cho 3G, 4G, 5G
ISIM|IP Multimedia Services Identity Module|Ứng dụng SIM cho IMS
UICC|Universal Integrated Circuit Card|Thẻ vi mạch chứa USIM, ISIM
AKA|Authentication and Key Agreement|Xác thực và thoả thuận khoá
EPS-AKA|EPS Authentication and Key Agreement|Xác thực 4G giữa UE và mạng
5G-AKA|5G Authentication and Key Agreement|Xác thực 5G chính
IMS-AKA|IMS Authentication and Key Agreement|Xác thực UE vào IMS
RAND|Random challenge|Số ngẫu nhiên mạng gửi để thách thức xác thực
AUTN|Authentication Token|Mã xác thực của mạng gửi cho UE
XRES|Expected Response|Đáp án mạng mong đợi từ UE
RES|Response|Đáp án UE tính từ RAND và khoá K
CK|Ciphering Key|Khoá mã hoá
IK|Integrity Key|Khoá toàn vẹn
SQN|Sequence Number|Số thứ tự chống phát lại trong xác thực
KSI|Key Set Identifier|Định danh bộ khoá bảo mật
EAP|Extensible Authentication Protocol|Giao thức xác thực mở rộng
EAP-TLS|EAP - Transport Layer Security|EAP dùng chứng chỉ TLS
IPsec|Internet Protocol Security|Bộ giao thức bảo mật IP
IKE|Internet Key Exchange|Trao đổi khoá Internet cho IPsec
IKEv2|Internet Key Exchange version 2|IKE bản 2
ESP|Encapsulating Security Payload|Đóng gói tải bảo mật của IPsec
SPI|Security Parameter Index|Chỉ số tham số bảo mật của IPsec
PSK|Pre-Shared Key|Khoá chia sẻ trước
DH|Diffie-Hellman|Thuật toán thoả thuận khoá Diffie-Hellman
ICV|Integrity Check Value|Giá trị kiểm tra toàn vẹn
DPD|Dead Peer Detection|Phát hiện đầu bên kia đã chết (IPsec)
TLS|Transport Layer Security|Bảo mật tầng giao vận
DTLS|Datagram Transport Layer Security|TLS cho UDP
AES|Advanced Encryption Standard|Chuẩn mã hoá nâng cao
SEPP|Security Edge Protection Proxy|Proxy biên bảo vệ báo hiệu giữa hai mạng 5G (N32)
SeGW|Security Gateway|Cổng bảo mật (kết thúc IPsec)
AMF|Access and Mobility Management Function|Chức năng quản lý truy nhập và di động (đăng ký, tìm gọi)
SMF|Session Management Function|Chức năng quản lý phiên (lập phiên PDU, điều khiển UPF)
UPF|User Plane Function|Chức năng mặt phẳng người dùng: chuyển tiếp gói
PCF|Policy Control Function|Chức năng điều khiển chính sách
UDM|Unified Data Management|Quản lý dữ liệu thuê bao hợp nhất
UDR|Unified Data Repository|Kho dữ liệu thuê bao hợp nhất
AUSF|Authentication Server Function|Chức năng máy chủ xác thực
NSSF|Network Slice Selection Function|Chức năng chọn lát cắt mạng
NRF|Network Repository Function|Chức năng kho đăng ký và tìm các NF
NEF|Network Exposure Function|Chức năng mở dịch vụ mạng cho bên ngoài
NWDAF|Network Data Analytics Function|Chức năng phân tích dữ liệu mạng
N3IWF|Non-3GPP InterWorking Function|Chức năng liên thông cho truy nhập không phải 3GPP (Wi-Fi)
LMF|Location Management Function|Chức năng quản lý định vị
AF|Application Function|Chức năng ứng dụng (ví dụ P-CSCF là một AF)
NF|Network Function|Chức năng mạng của lõi 5G
SBA|Service-Based Architecture|Kiến trúc dựa trên dịch vụ
SBI|Service-Based Interface|Giao diện dựa trên dịch vụ (HTTP/2 giữa các NF)
CHF|Charging Function|Chức năng tính cước hội tụ của 5G
SMSF|Short Message Service Function|Chức năng SMS của 5G
SMSC|Short Message Service Centre|Trung tâm tin nhắn ngắn
OCS|Online Charging System|Hệ thống tính cước trực tuyến (trả trước)
CDF|Charging Data Function|Chức năng dữ liệu tính cước (offline)
CGF|Charging Gateway Function|Cổng tập hợp bản ghi cước
SCP|Service Communication Proxy (5G) / Service Control Point (2G, 3G)|Proxy truyền thông dịch vụ trong lõi 5G; điểm điều khiển dịch vụ (CAMEL) trong 2G, 3G
IMS|IP Multimedia Subsystem|Phân hệ đa phương tiện IP: thoại, video, SMS trên nền IP
HSS|Home Subscriber Server|Máy chủ thuê bao nhà: dữ liệu thuê bao 4G và IMS
PCRF|Policy and Charging Rules Function|Chức năng luật chính sách và tính cước của 4G
MME|Mobility Management Entity|Thực thể quản lý di động 4G
S-GW|Serving Gateway|Cổng phục vụ: neo di động mặt phẳng người dùng 4G
P-GW|PDN Gateway|Cổng mạng dữ liệu gói: cấp IP, ra internet, thi hành PCC
SGW|Serving Gateway|Cổng phục vụ 4G
PGW|PDN Gateway|Cổng mạng dữ liệu gói 4G
EIR|Equipment Identity Register|Thanh ghi nhận dạng thiết bị (danh sách trắng, đen IMEI)
MSC|Mobile Switching Centre|Tổng đài di động chuyển mạch kênh
VLR|Visitor Location Register|Thanh ghi vị trí tạm trú
HLR|Home Location Register|Thanh ghi vị trí thường trú (2G, 3G)
AuC|Authentication Centre|Trung tâm xác thực (giữ khoá K)
SGSN|Serving GPRS Support Node|Nút hỗ trợ GPRS phục vụ (miền gói 2G, 3G)
GGSN|Gateway GPRS Support Node|Nút cổng GPRS (ra mạng dữ liệu)
GMSC|Gateway Mobile Switching Centre|Tổng đài cổng: nhận cuộc gọi vào mạng
MGW|Media Gateway|Cổng media: chuyển đổi kênh thoại và gói
RNC|Radio Network Controller|Bộ điều khiển mạng vô tuyến 3G
STP|Signal Transfer Point (SS7) / Spanning Tree Protocol (LAN)|Điểm chuyển tiếp báo hiệu SS7; hoặc giao thức cây bao trùm chống vòng lặp ở LAN
P-CSCF|Proxy Call Session Control Function|Điểm SIP đầu tiên UE chạm tới trong IMS
I-CSCF|Interrogating Call Session Control Function|Cửa vào mạng IMS nhà, hỏi HSS tìm S-CSCF
S-CSCF|Serving Call Session Control Function|Trung tâm điều khiển phiên IMS: đăng ký, định tuyến, gọi AS
E-CSCF|Emergency Call Session Control Function|CSCF xử lý cuộc gọi khẩn cấp
CSCF|Call Session Control Function|Chức năng điều khiển phiên cuộc gọi của IMS
TAS|Telephony Application Server|Máy chủ ứng dụng thoại (MMTel): dịch vụ bổ sung, tính cước
MTAS|Mobile Telephony Application Server|Máy chủ ứng dụng thoại (tên sản phẩm Ericsson)
SCC AS|Service Centralization and Continuity Application Server|Máy chủ neo cuộc gọi để chuyển phiên (SRVCC)
IP-SM-GW|IP Short Message Gateway|Cổng tin nhắn ngắn giữa SIP và SMSC
MRF|Media Resource Function|Chức năng tài nguyên media: thông báo, nhạc chờ, hội nghị
IBCF|Interconnection Border Control Function|Chức năng điều khiển biên khi nối IMS hai mạng
BGCF|Breakout Gateway Control Function|Chức năng chọn cổng ra mạng chuyển mạch kênh
MGCF|Media Gateway Control Function|Chức năng điều khiển cổng media (SIP sang ISUP)
IM-MGW|IP Multimedia Media Gateway|Cổng media của IMS
ATCF|Access Transfer Control Function|Chức năng điều khiển chuyển truy nhập (SRVCC)
ATGW|Access Transfer Gateway|Cổng media chuyển truy nhập
TrGW|Transition Gateway|Cổng media biên giữa hai mạng IMS
IMS-AGW|IMS Access Gateway|Cổng truy nhập media của IMS
SBC|Session Border Controller|Bộ điều khiển biên phiên: che topology, neo media, bảo mật
LRF|Location Retrieval Function|Chức năng lấy vị trí cho cuộc gọi khẩn cấp
ENUM|E.164 Number Mapping|Ánh xạ số E.164 sang địa chỉ SIP qua DNS
DNS|Domain Name System|Hệ thống tên miền
NAPTR|Naming Authority Pointer|Bản ghi DNS dùng cho ENUM và tìm dịch vụ
FQDN|Fully Qualified Domain Name|Tên miền đầy đủ
DEA|Diameter Edge Agent|Tác tử biên Diameter giữa hai mạng
DRA|Diameter Routing Agent|Tác tử định tuyến Diameter
CPRI|Common Public Radio Interface|Giao diện vô tuyến công cộng chung (BBU nối RRU)
eCPRI|enhanced CPRI|CPRI nâng cao chạy trên Ethernet (5G fronthaul)
SIP|Session Initiation Protocol|Giao thức khởi tạo phiên: báo hiệu của IMS
SDP|Session Description Protocol|Giao thức mô tả phiên: bộ mã, cổng, băng thông
RTP|Real-time Transport Protocol|Giao thức truyền thời gian thực chở tiếng nói
RTCP|RTP Control Protocol|Giao thức điều khiển RTP: báo mất gói, jitter
INVITE|SIP INVITE|Bản tin SIP mời mở phiên (gọi)
ACK|Acknowledgement|Bản tin xác nhận (SIP ACK, TCP ACK)
BYE|SIP BYE|Bản tin SIP kết thúc phiên
CANCEL|SIP CANCEL|Bản tin SIP huỷ lời mời chưa trả lời
REGISTER|SIP REGISTER|Bản tin SIP đăng ký vào IMS
PRACK|Provisional Response Acknowledgement|Xác nhận bản tin tạm thời có tin cậy (RFC 3262)
UPDATE|SIP UPDATE|Bản tin SIP cập nhật phiên (RFC 3311)
OPTIONS|SIP OPTIONS|Bản tin SIP hỏi khả năng hoặc kiểm tra sống
SUBSCRIBE|SIP SUBSCRIBE|Bản tin SIP đăng ký nhận thông báo sự kiện
NOTIFY|SIP NOTIFY|Bản tin SIP báo sự kiện
MESSAGE|SIP MESSAGE|Bản tin SIP chở tin nhắn ngắn
VoLTE|Voice over LTE|Thoại trên LTE qua IMS
VoNR|Voice over New Radio|Thoại trên 5G NR qua IMS
ViLTE|Video over LTE|Video qua LTE
VoWiFi|Voice over Wi-Fi|Thoại qua Wi-Fi
EPS-FB|EPS Fallback|Thoại 5G chuyển xuống LTE để dùng VoLTE
SRVCC|Single Radio Voice Call Continuity|Liên tục cuộc gọi thoại một sóng vô tuyến (VoLTE xuống 3G, 2G)
eSRVCC|enhanced SRVCC|SRVCC nâng cao dùng ATCF
bSRVCC|SRVCC for calls in pre-alerting phase|SRVCC khi cuộc gọi chưa tới giai đoạn đổ chuông
aSRVCC|SRVCC for calls in alerting phase|SRVCC cho cuộc gọi đang đổ chuông
CSFB|Circuit Switched Fallback|Rơi về chuyển mạch kênh: UE 4G xuống 2G, 3G để gọi
MMTel|Multimedia Telephony|Dịch vụ thoại và đa phương tiện của IMS
VoPS|Voice over PS|Cờ mạng báo hỗ trợ thoại qua miền gói
AMR|Adaptive Multi-Rate|Bộ mã thoại băng hẹp thích ứng tốc độ
AMR-WB|Adaptive Multi-Rate Wideband|Bộ mã thoại băng rộng (HD Voice)
EVS|Enhanced Voice Services|Bộ mã thoại nâng cao của 3GPP
MOS|Mean Opinion Score|Điểm chất lượng thoại trung bình (1 đến 5)
CAMEL|Customised Applications for Mobile network Enhanced Logic|Logic mạng thông minh cho cước trả trước 2G, 3G
CAP|CAMEL Application Part|Giao thức ứng dụng của CAMEL
MAP|Mobile Application Part|Giao thức báo hiệu SS7 giữa các nút lõi 2G, 3G
SS7|Signalling System No. 7|Hệ thống báo hiệu số 7
SCCP|Signalling Connection Control Part|Phần điều khiển kết nối báo hiệu SS7
TCAP|Transaction Capabilities Application Part|Phần ứng dụng khả năng giao dịch SS7
ISUP|ISDN User Part|Phần người dùng ISDN: báo hiệu cuộc gọi giữa tổng đài
M3UA|MTP3 User Adaptation|Lớp thích ứng SS7 trên SCTP (SIGTRAN)
SIGTRAN|Signalling Transport|Họ giao thức chở SS7 trên IP
SCTP|Stream Control Transmission Protocol|Giao thức truyền theo luồng, chở S1AP, NGAP, Diameter
RANAP|Radio Access Network Application Part|Giao thức giữa RNC và lõi 3G (Iu)
NBAP|NodeB Application Part|Giao thức giữa RNC và NodeB (Iub)
S1AP|S1 Application Protocol|Giao thức ứng dụng S1 giữa eNB và MME
NGAP|NG Application Protocol|Giao thức ứng dụng NG giữa gNB và AMF
X2AP|X2 Application Protocol|Giao thức ứng dụng X2 giữa các eNB
XnAP|Xn Application Protocol|Giao thức ứng dụng Xn giữa các gNB
F1AP|F1 Application Protocol|Giao thức ứng dụng F1 giữa CU và DU
E1AP|E1 Application Protocol|Giao thức ứng dụng E1 giữa CU-CP và CU-UP
SGsAP|SGs Application Part|Giao thức SGs giữa MME và MSC (CSFB, SMS)
Diameter|Diameter Base Protocol|Giao thức AAA kế nhiệm RADIUS, dùng cho S6a, Gx, Rx, Cx, Ro
AVP|Attribute-Value Pair|Cặp thuộc tính giá trị trong bản tin Diameter
CCR|Credit-Control-Request|Yêu cầu kiểm soát tín dụng (Gx, Gy, Ro)
CCA|Credit-Control-Answer|Trả lời kiểm soát tín dụng
CCR-I|Credit-Control-Request Initial|Yêu cầu kiểm soát tín dụng khởi tạo phiên
CCR-T|Credit-Control-Request Termination|Yêu cầu kiểm soát tín dụng kết thúc phiên
AAR|AA-Request|Yêu cầu xác thực, cấp quyền (Rx: gửi mô tả media)
AAA|AA-Answer (Diameter) / Authentication, Authorization and Accounting|Trả lời AA; hoặc nhóm chức năng xác thực, cấp quyền, kế toán
STR|Session-Termination-Request|Yêu cầu kết thúc phiên Diameter
STA|Session-Termination-Answer|Trả lời kết thúc phiên Diameter
RAR|Re-Auth-Request (Diameter) / Random Access Response (vô tuyến)|Yêu cầu xác thực lại (cài luật PCC); hoặc phản hồi truy nhập ngẫu nhiên
RAA|Re-Auth-Answer|Trả lời Re-Auth
ASR|Abort-Session-Request|Yêu cầu huỷ phiên Diameter
ASA|Abort-Session-Answer|Trả lời huỷ phiên
UAR|User-Authorization-Request|Cx: hỏi quyền đăng ký của thuê bao
UAA|User-Authorization-Answer|Trả lời UAR
MAR|Multimedia-Auth-Request|Cx: xin vector xác thực IMS
MAA|Multimedia-Auth-Answer|Trả lời MAR
SAR|Server-Assignment-Request|Cx: ghi nhận S-CSCF và tải hồ sơ
SAA|Server-Assignment-Answer|Trả lời SAR
LIR|Location-Info-Request|Cx: hỏi S-CSCF đang phục vụ thuê bao
LIA|Location-Info-Answer|Trả lời LIR
AIR|Authentication-Information-Request|S6a: xin vector xác thực
AIA|Authentication-Information-Answer|Trả lời AIR
ULR|Update-Location-Request|S6a: cập nhật vị trí và xin hồ sơ
ULA|Update-Location-Answer|Trả lời ULR
CLR|Cancel-Location-Request|S6a: HSS huỷ đăng ký ở MME cũ
DDN|Downlink Data Notification|MME được báo có dữ liệu xuống cho UE đang rảnh
T-ADS|Terminating Access Domain Selection|Chọn miền truy nhập cho cuộc gọi đến
STN-SR|Session Transfer Number for SRVCC|Số chuyển phiên dùng cho SRVCC
iFC|initial Filter Criteria|Tiêu chí lọc ban đầu: khi nào S-CSCF gọi máy chủ ứng dụng
ISC|IMS Service Control|Giao diện giữa S-CSCF và máy chủ ứng dụng
XCAP|XML Configuration Access Protocol|Giao thức cấu hình dịch vụ qua HTTP (giao diện Ut)
PCO|Protocol Configuration Options|Tuỳ chọn cấu hình giao thức (mang địa chỉ P-CSCF cho UE)
EBI|EPS Bearer ID|Định danh bearer EPS
ESM|EPS Session Management|Quản lý phiên EPS (NAS, bearer)
EMM|EPS Mobility Management|Quản lý di động EPS (NAS, đăng ký)
GMM|GPRS Mobility Management|Quản lý di động GPRS
5GMM|5G Mobility Management|Quản lý di động 5G (NAS)
5GSM|5G Session Management|Quản lý phiên 5G (NAS)
UECM|UE Context Management|Quản lý ngữ cảnh UE (dịch vụ Nudm)
SDM|Subscriber Data Management|Quản lý dữ liệu thuê bao (dịch vụ Nudm)
GUAMI|Globally Unique AMF Identifier|Định danh AMF duy nhất toàn cục
SMS|Short Message Service|Dịch vụ tin nhắn ngắn
SMPP|Short Message Peer-to-Peer|Giao thức tin nhắn giữa SMSC và ứng dụng
SMS-SUBMIT|SMS-SUBMIT|Bản tin SMS từ máy gửi lên SMSC
SMS-DELIVER|SMS-DELIVER|Bản tin SMS từ SMSC giao xuống máy nhận
RP-DATA|Relay Protocol DATA|Bản tin tầng chuyển tiếp chở SMS
RP-ACK|Relay Protocol ACK|Xác nhận tầng chuyển tiếp SMS
CP-DATA|Control Protocol DATA|Bản tin tầng điều khiển chở SMS qua NAS
MO|Mobile Originating|Phía gọi, phía gửi (từ UE đi)
MT|Mobile Terminating|Phía bị gọi, phía nhận (tới UE)
HO|Handover|Chuyển giao
CHO|Conditional Handover|Chuyển giao có điều kiện
RLF|Radio Link Failure|Mất liên kết vô tuyến
RACH|Random Access Channel|Kênh truy nhập ngẫu nhiên
PRACH|Physical Random Access Channel|Kênh vật lý truy nhập ngẫu nhiên
SSB|Synchronization Signal Block|Khối tín hiệu đồng bộ (PSS, SSS, PBCH)
PSS|Primary Synchronization Signal|Tín hiệu đồng bộ sơ cấp
SSS|Secondary Synchronization Signal|Tín hiệu đồng bộ thứ cấp
PBCH|Physical Broadcast Channel|Kênh vật lý quảng bá (mang MIB)
MIB|Master Information Block|Khối thông tin chính
SIB|System Information Block|Khối thông tin hệ thống
SIB1|System Information Block Type 1|Khối thông tin hệ thống loại 1 (truy nhập cell)
PDCCH|Physical Downlink Control Channel|Kênh điều khiển đường xuống
PDSCH|Physical Downlink Shared Channel|Kênh dữ liệu đường xuống
PUCCH|Physical Uplink Control Channel|Kênh điều khiển đường lên
PUSCH|Physical Uplink Shared Channel|Kênh dữ liệu đường lên
DCI|Downlink Control Information|Thông tin điều khiển đường xuống
UCI|Uplink Control Information|Thông tin điều khiển đường lên
CORESET|Control Resource Set|Tập tài nguyên điều khiển chứa PDCCH
DMRS|Demodulation Reference Signal|Tín hiệu tham chiếu giải điều chế
CSI-RS|Channel State Information Reference Signal|Tín hiệu tham chiếu đo trạng thái kênh
SRS|Sounding Reference Signal|Tín hiệu tham chiếu thăm dò đường lên
CSI|Channel State Information|Thông tin trạng thái kênh
CQI|Channel Quality Indicator|Chỉ số chất lượng kênh
PMI|Precoding Matrix Indicator|Chỉ số ma trận tiền mã hoá
RI|Rank Indicator|Chỉ số hạng (số luồng MIMO)
RSRP|Reference Signal Received Power|Công suất tín hiệu tham chiếu thu được
RSRQ|Reference Signal Received Quality|Chất lượng tín hiệu tham chiếu thu được
RSSI|Received Signal Strength Indicator|Cường độ tín hiệu thu tổng
SINR|Signal to Interference plus Noise Ratio|Tỉ số tín hiệu trên nhiễu cộng tạp âm
SNR|Signal to Noise Ratio|Tỉ số tín hiệu trên tạp âm
BLER|Block Error Rate|Tỉ lệ khối lỗi
MCS|Modulation and Coding Scheme|Sơ đồ điều chế và mã hoá
TBS|Transport Block Size|Kích thước khối truyền tải
PRB|Physical Resource Block|Khối tài nguyên vật lý (12 sóng mang con)
RB|Resource Block|Khối tài nguyên
RE|Resource Element|Phần tử tài nguyên (1 sóng mang con × 1 ký hiệu)
BWP|Bandwidth Part|Phần băng thông của sóng mang
SCS|Subcarrier Spacing|Khoảng cách sóng mang con
FDD|Frequency Division Duplex|Song công phân chia theo tần số
TDD|Time Division Duplex|Song công phân chia theo thời gian
DL|Downlink|Đường xuống (mạng tới UE)
UL|Uplink|Đường lên (UE tới mạng)
OFDM|Orthogonal Frequency Division Multiplexing|Ghép kênh phân chia tần số trực giao
OFDMA|Orthogonal Frequency Division Multiple Access|Đa truy nhập OFDM
SC-FDMA|Single Carrier FDMA|Đa truy nhập một sóng mang cho đường lên LTE
MIMO|Multiple Input Multiple Output|Nhiều anten phát, nhiều anten thu
MU-MIMO|Multi-User MIMO|MIMO nhiều người dùng cùng tài nguyên
SU-MIMO|Single-User MIMO|MIMO một người dùng
TTI|Transmission Time Interval|Khoảng thời gian truyền (1 ms trong LTE)
DRX|Discontinuous Reception|Thu không liên tục để tiết kiệm pin
DTX|Discontinuous Transmission|Phát không liên tục
PHR|Power Headroom Report|Báo cáo dư công suất của UE
BSR|Buffer Status Report|Báo cáo trạng thái bộ đệm của UE
SR|Scheduling Request|Yêu cầu lập lịch
TA|Timing Advance (vô tuyến) / Tracking Area (di động)|Lệnh sớm thời gian phát; hoặc vùng theo dõi
FR1|Frequency Range 1|Dải tần 410 MHz đến 7,125 GHz của NR
FR2|Frequency Range 2|Dải tần sóng milimét 24,25 đến 52,6 GHz của NR
EIRP|Effective Isotropic Radiated Power|Công suất bức xạ đẳng hướng hiệu dụng
EARFCN|E-UTRA Absolute Radio Frequency Channel Number|Số kênh tần số tuyệt đối của LTE
NR-ARFCN|NR Absolute Radio Frequency Channel Number|Số kênh tần số tuyệt đối của NR
PCI|Physical Cell Identity|Định danh cell vật lý
ANR|Automatic Neighbour Relation|Tự động quản lý quan hệ cell lân cận
SON|Self-Organizing Network|Mạng tự tổ chức
IAB|Integrated Access and Backhaul|Truy nhập và backhaul tích hợp
NTN|Non-Terrestrial Network|Mạng phi mặt đất (vệ tinh)
V2X|Vehicle-to-Everything|Xe giao tiếp với mọi thứ
DSS|Dynamic Spectrum Sharing|Chia sẻ phổ động giữa LTE và NR
CCE|Control Channel Element|Phần tử kênh điều khiển
GNSS|Global Navigation Satellite System|Hệ thống vệ tinh định vị toàn cầu (GPS, Galileo...)
N1|Reference point N1|Giao diện UE và AMF (NAS)
N2|Reference point N2|Giao diện gNB và AMF (NGAP)
N3|Reference point N3|Giao diện gNB và UPF (GTP-U)
N4|Reference point N4|Giao diện SMF và UPF (PFCP)
N5|Reference point N5|Giao diện PCF và AF (ví dụ P-CSCF)
N6|Reference point N6|Giao diện UPF và mạng dữ liệu
N7|Reference point N7|Giao diện SMF và PCF
N8|Reference point N8|Giao diện AMF và UDM
N9|Reference point N9|Giao diện giữa hai UPF
N10|Reference point N10|Giao diện SMF và UDM
N11|Reference point N11|Giao diện AMF và SMF
N12|Reference point N12|Giao diện AMF và AUSF
N13|Reference point N13|Giao diện AUSF và UDM
N15|Reference point N15|Giao diện AMF và PCF
N17|Reference point N17|Giao diện AMF và EIR
N20|Reference point N20|Giao diện AMF và SMSF
N21|Reference point N21|Giao diện SMSF và UDM
N26|Reference point N26|Giao diện AMF và MME (liên thông 4G, 5G)
N28|Reference point N28|Giao diện PCF và CHF
N32|Reference point N32|Giao diện giữa hai SEPP (roaming 5G)
N35|Reference point N35|Giao diện UDM và UDR
N36|Reference point N36|Giao diện PCF và UDR
N40|Reference point N40|Giao diện SMF và CHF
NG|NG interface|Giao diện giữa NG-RAN và 5GC
NG-C|NG Control plane|Phần điều khiển của giao diện NG (N2)
NG-U|NG User plane|Phần dữ liệu của giao diện NG (N3)
Xn|Xn interface|Giao diện giữa hai gNB
X2|X2 interface|Giao diện giữa hai eNB (hoặc eNB và en-gNB)
F1|F1 interface|Giao diện giữa CU và DU
F1-C|F1 Control plane|Phần điều khiển của giao diện F1
F1-U|F1 User plane|Phần dữ liệu của giao diện F1
E1|E1 interface|Giao diện giữa CU-CP và CU-UP
Uu|Uu interface|Giao diện vô tuyến giữa UE và trạm gốc
S1|S1 interface|Giao diện giữa eNB và lõi EPC
S1-MME|S1 for the MME|Phần điều khiển của S1 tới MME
S1-U|S1 User plane|Phần dữ liệu của S1 tới S-GW
S5|S5 interface|Giao diện S-GW và P-GW cùng mạng
S8|S8 interface|Giao diện S-GW và P-GW khi roaming
S6a|S6a interface|Giao diện MME và HSS (Diameter)
S10|S10 interface|Giao diện giữa hai MME
S11|S11 interface|Giao diện MME và S-GW (GTPv2-C)
S13|S13 interface|Giao diện MME và EIR
SGs|SGs interface|Giao diện MME và MSC/VLR (CSFB, SMS)
SGd|SGd interface|Giao diện MME và SMSC (SMS qua LTE)
SGi|SGi interface|Giao diện P-GW và mạng dữ liệu ngoài
Gx|Gx interface|Giao diện P-GW và PCRF (luật PCC)
Gy|Gy interface|Giao diện P-GW và OCS (tính cước online)
Rx|Rx interface|Giao diện P-CSCF và PCRF (QoS cho thoại)
Ro|Ro interface|Giao diện tính cước online giữa TAS và OCS
Cx|Cx interface|Giao diện CSCF và HSS (Diameter)
Sh|Sh interface|Giao diện máy chủ ứng dụng và HSS
Sy|Sy interface|Giao diện PCRF và OCS
Gm|Gm interface|Giao diện UE và P-CSCF (SIP)
Mw|Mw interface|Giao diện giữa các CSCF (SIP)
Mr|Mr interface|Giao diện S-CSCF hoặc TAS với MRF
Mx|Mx interface|Giao diện CSCF với IBCF
Mi|Mi interface|Giao diện S-CSCF với BGCF
Mj|Mj interface|Giao diện BGCF với MGCF
Mg|Mg interface|Giao diện S-CSCF với MGCF
Mb|Mb interface|Giao diện chở media (RTP) của IMS
Ut|Ut interface|Giao diện UE và TAS (XCAP, cấu hình dịch vụ)
Gn|Gn interface|Giao diện SGSN và GGSN (GTPv1)
Gi|Gi interface|Giao diện GGSN và mạng dữ liệu ngoài
Gr|Gr interface|Giao diện SGSN và HLR
Iu-CS|Iu Circuit-Switched|Giao diện RNC và lõi chuyển mạch kênh 3G
Iu-PS|Iu Packet-Switched|Giao diện RNC và lõi chuyển mạch gói 3G
Iub|Iub interface|Giao diện RNC và NodeB
Iur|Iur interface|Giao diện giữa hai RNC
Mc|Mc interface|Giao diện MSC Server và MGW (H.248)
Nc|Nc interface|Giao diện giữa MSC Server khi gọi liên tổng đài
Sv|Sv interface|Giao diện MME và MSC (SRVCC)
RFC|Request for Comments|Tài liệu chuẩn của IETF
3GPP|3rd Generation Partnership Project|Tổ chức chuẩn hoá di động toàn cầu
GSMA|GSM Association|Hiệp hội các nhà mạng di động
IETF|Internet Engineering Task Force|Tổ chức chuẩn hoá Internet
IEEE|Institute of Electrical and Electronics Engineers|Viện kỹ sư điện và điện tử
ETSI|European Telecommunications Standards Institute|Viện tiêu chuẩn viễn thông châu Âu
ITU-T|ITU Telecommunication Standardization Sector|Bộ phận tiêu chuẩn viễn thông của ITU
ITU-R|ITU Radiocommunication Sector|Bộ phận vô tuyến của ITU
KPI|Key Performance Indicator|Chỉ số hiệu năng chính
KQI|Key Quality Indicator|Chỉ số chất lượng chính
OSS|Operations Support System|Hệ thống hỗ trợ vận hành
BSS|Business Support System|Hệ thống hỗ trợ kinh doanh
SLA|Service Level Agreement|Thoả thuận mức dịch vụ
NMS|Network Management System|Hệ thống quản lý mạng
VLAN|Virtual Local Area Network|Mạng LAN ảo
LAN|Local Area Network|Mạng cục bộ
WAN|Wide Area Network|Mạng diện rộng
WLAN|Wireless Local Area Network|Mạng LAN không dây
VRF|Virtual Routing and Forwarding|Bảng định tuyến ảo tách theo khách hàng
VPN|Virtual Private Network|Mạng riêng ảo
VXLAN|Virtual Extensible LAN|LAN ảo mở rộng (đóng gói L2 trong UDP)
EVPN|Ethernet VPN|VPN Ethernet dùng BGP
MPLS|Multiprotocol Label Switching|Chuyển mạch nhãn đa giao thức
LDP|Label Distribution Protocol|Giao thức phân phối nhãn MPLS
LSP|Label Switched Path|Đường chuyển mạch nhãn
LSR|Label Switching Router|Bộ định tuyến chuyển mạch nhãn
RSVP|Resource Reservation Protocol|Giao thức đặt trước tài nguyên
RSVP-TE|RSVP - Traffic Engineering|RSVP cho kỹ thuật lưu lượng MPLS
SR|Segment Routing (chuyển tiếp) / Scheduling Request (vô tuyến)|Định tuyến theo đoạn; hoặc yêu cầu lập lịch
SR-MPLS|Segment Routing over MPLS|Định tuyến theo đoạn trên MPLS
SRv6|Segment Routing over IPv6|Định tuyến theo đoạn trên IPv6
SR-TE|Segment Routing Traffic Engineering|Kỹ thuật lưu lượng bằng định tuyến theo đoạn
TI-LFA|Topology-Independent Loop-Free Alternate|Đường dự phòng không vòng lặp, độc lập topo
SRGB|Segment Routing Global Block|Dải nhãn toàn cục của SR
FRR|Fast Reroute|Chuyển hướng nhanh khi lỗi
OSPF|Open Shortest Path First|Giao thức định tuyến trạng thái liên kết OSPF
IS-IS|Intermediate System to Intermediate System|Giao thức định tuyến trạng thái liên kết IS-IS
BGP|Border Gateway Protocol|Giao thức cổng biên giữa các AS
MP-BGP|Multiprotocol BGP|BGP đa giao thức (VPNv4, EVPN)
EIGRP|Enhanced Interior Gateway Routing Protocol|Giao thức định tuyến nội bộ nâng cao của Cisco
RIP|Routing Information Protocol|Giao thức thông tin định tuyến
IGP|Interior Gateway Protocol|Giao thức định tuyến nội miền (OSPF, IS-IS)
LSA|Link State Advertisement|Quảng bá trạng thái liên kết của OSPF
LSDB|Link State Database|Cơ sở dữ liệu trạng thái liên kết
ABR|Area Border Router|Router biên vùng OSPF
ASBR|Autonomous System Boundary Router|Router biên hệ tự trị
DR|Designated Router|Router chỉ định của OSPF
BDR|Backup Designated Router|Router chỉ định dự phòng
NSSA|Not-So-Stubby Area|Vùng gần cụt của OSPF
SPF|Shortest Path First|Thuật toán đường đi ngắn nhất
BFD|Bidirectional Forwarding Detection (mạng) / Beam Failure Detection (vô tuyến)|Phát hiện lỗi đường truyền hai chiều nhanh; hoặc phát hiện lỗi búp sóng
ECMP|Equal-Cost Multi-Path|Chia tải nhiều đường chi phí bằng nhau
PIM|Protocol Independent Multicast|Giao thức multicast độc lập định tuyến
IGMP|Internet Group Management Protocol|Giao thức quản lý nhóm multicast
HSRP|Hot Standby Router Protocol|Giao thức router dự phòng nóng (Cisco)
VRRP|Virtual Router Redundancy Protocol|Giao thức dự phòng router ảo
RSTP|Rapid Spanning Tree Protocol|Cây bao trùm nhanh
PVST|Per-VLAN Spanning Tree|Cây bao trùm theo từng VLAN
BPDU|Bridge Protocol Data Unit|Bản tin điều khiển của cây bao trùm
LACP|Link Aggregation Control Protocol|Giao thức gộp liên kết
PAgP|Port Aggregation Protocol|Giao thức gộp cổng của Cisco
DTP|Dynamic Trunking Protocol|Giao thức trunk động của Cisco
PTP|Precision Time Protocol|Giao thức đồng bộ thời gian chính xác (IEEE 1588)
SyncE|Synchronous Ethernet|Ethernet đồng bộ tần số
ESMC|Ethernet Synchronization Messaging Channel|Kênh bản tin đồng bộ Ethernet
NTP|Network Time Protocol|Giao thức đồng bộ thời gian mạng
TWAMP|Two-Way Active Measurement Protocol|Giao thức đo chủ động hai chiều
STAMP|Simple Two-way Active Measurement Protocol|Giao thức đo chủ động hai chiều đơn giản
OSNR|Optical Signal-to-Noise Ratio|Tỉ số tín hiệu quang trên nhiễu
DWDM|Dense Wavelength Division Multiplexing|Ghép bước sóng mật độ cao
WDM|Wavelength Division Multiplexing|Ghép kênh theo bước sóng
OLS|Optical Line System|Hệ thống truyền dẫn quang
FEC|Forward Error Correction|Sửa lỗi tiến
CRC|Cyclic Redundancy Check|Kiểm tra dư thừa vòng
MTU|Maximum Transmission Unit|Kích thước gói tối đa của đường truyền
MSS|Maximum Segment Size|Kích thước đoạn TCP tối đa
TTL|Time To Live|Thời gian sống của gói IP (số chặng)
DSCP|Differentiated Services Code Point|Mã phân loại dịch vụ trong tiêu đề IP
CoS|Class of Service|Lớp dịch vụ (tiêu đề VLAN, 802.1p)
EF|Expedited Forwarding|Chuyển tiếp khẩn (lớp thoại)
AF|Assured Forwarding (IP QoS) / Application Function (5G)|Chuyển tiếp bảo đảm; hoặc chức năng ứng dụng
LLQ|Low Latency Queuing|Hàng đợi trễ thấp
CBWFQ|Class-Based Weighted Fair Queuing|Xếp hàng công bằng có trọng số theo lớp
WRED|Weighted Random Early Detection|Loại gói sớm ngẫu nhiên có trọng số
HQoS|Hierarchical QoS|QoS phân cấp
CIR|Committed Information Rate|Tốc độ thông tin cam kết
ACL|Access Control List|Danh sách điều khiển truy cập
NAT|Network Address Translation|Dịch địa chỉ mạng
CGNAT|Carrier-Grade NAT|NAT cấp nhà mạng
NAT64|NAT64|Chuyển đổi giữa IPv6 và IPv4
DNS64|DNS64|Tổng hợp bản ghi AAAA cho NAT64
PAT|Port Address Translation|Dịch địa chỉ theo cổng
DHCP|Dynamic Host Configuration Protocol|Giao thức cấp địa chỉ IP động
DHCPv6|DHCP for IPv6|DHCP cho IPv6
SLAAC|Stateless Address Autoconfiguration|Tự cấu hình địa chỉ IPv6 không trạng thái
ND|Neighbor Discovery|Khám phá láng giềng của IPv6
DAD|Duplicate Address Detection|Phát hiện trùng địa chỉ
ICMP|Internet Control Message Protocol|Giao thức bản tin điều khiển Internet (ping)
ICMPv6|ICMP for IPv6|ICMP cho IPv6
IP|Internet Protocol|Giao thức Internet
IPv4|Internet Protocol version 4|Giao thức Internet bản 4
IPv6|Internet Protocol version 6|Giao thức Internet bản 6
IPv4v6|IPv4 and IPv6 dual stack|Loại PDN có cả IPv4 và IPv6
TCP|Transmission Control Protocol|Giao thức điều khiển truyền
UDP|User Datagram Protocol|Giao thức datagram người dùng
QUIC|QUIC|Giao thức giao vận trên UDP, thay TCP cho HTTP/3
HTTP|Hypertext Transfer Protocol|Giao thức truyền siêu văn bản
HTTPS|HTTP Secure|HTTP chạy trên TLS
SSH|Secure Shell|Truy cập dòng lệnh an toàn
SNMP|Simple Network Management Protocol|Giao thức quản lý mạng đơn giản
NETCONF|Network Configuration Protocol|Giao thức cấu hình mạng
RESTCONF|REST Configuration Protocol|Giao thức cấu hình mạng qua REST
YANG|Yet Another Next Generation|Ngôn ngữ mô hình dữ liệu cấu hình mạng
JSON|JavaScript Object Notation|Định dạng dữ liệu JSON
XML|Extensible Markup Language|Ngôn ngữ đánh dấu mở rộng
REST|Representational State Transfer|Phong cách API REST
API|Application Programming Interface|Giao diện lập trình ứng dụng
CLI|Command Line Interface|Giao diện dòng lệnh
RADIUS|Remote Authentication Dial-In User Service|Dịch vụ xác thực người dùng quay số từ xa
TACACS|Terminal Access Controller Access-Control System|Hệ thống điều khiển truy cập thiết bị
CAPWAP|Control And Provisioning of Wireless Access Points|Giao thức điều khiển điểm truy cập Wi-Fi
WLC|Wireless LAN Controller|Bộ điều khiển mạng LAN không dây
SSID|Service Set Identifier|Tên mạng Wi-Fi
WPA2|Wi-Fi Protected Access 2|Chuẩn bảo mật Wi-Fi 2
EAPOL|EAP over LAN|EAP chạy trên LAN (802.1X)
EID|Endpoint Identifier|Định danh điểm cuối (LISP)
LISP|Locator/ID Separation Protocol|Giao thức tách định danh và vị trí
FIB|Forwarding Information Base|Bảng chuyển tiếp
LFIB|Label Forwarding Information Base|Bảng chuyển tiếp nhãn
RD|Route Distinguisher|Bộ phân biệt tuyến VPN
RT|Route Target|Nhãn nhập xuất tuyến VPN
PE|Provider Edge|Router biên nhà cung cấp
CE|Customer Edge|Router biên khách hàng
ISP|Internet Service Provider|Nhà cung cấp dịch vụ Internet
IPX|IP eXchange|Mạng trao đổi IP giữa các nhà mạng (roaming)
ASN|Autonomous System Number|Số hệ tự trị
OID|Object Identifier|Định danh đối tượng SNMP
MIB-II|Management Information Base II|Cơ sở thông tin quản lý SNMP
FCS|Frame Check Sequence|Chuỗi kiểm tra khung Ethernet
SFP|Small Form-factor Pluggable|Module quang cắm nhỏ
TCN|Topology Change Notification|Thông báo đổi topo của cây bao trùm
DHCPv4|DHCP for IPv4|DHCP cho IPv4`;
var GL=Object.create(null);
RAW.split('\n').forEach(function(l){var p=l.split('|');if(p.length>=3&&p[0])GL[p[0]]={k:p[0],en:p[1],vi:p.slice(2).join('|')};});
try{if(typeof ML3DICT!=='undefined')ML3DICT.forEach(function(r){var k=r[0];if(k&&!GL[k]&&/^[A-Z][A-Z0-9\-]{2,9}$/.test(k)&&r[1]&&r[2])GL[k]={k:k,en:r[1],vi:r[2]};});}catch(e){}

/* ----- khối mạng: khoá thuật ngữ -> khối trong KB, KBX (lấy giao diện để vẽ hình) ----- */
var KIND={'UE':'ue','gNB':'gnb','eNB':'enb','AMF':'amf','SMF':'smf','UPF':'upf','PCF':'pcf','PCRF':'pcrf','UDM':'udm','UDR':'udr','AUSF':'ausf','EIR':'eir','SMSF':'smsf','SMSC':'smsc','OCS':'ocs','CHF':'ocs','IMS':'ims','P-CSCF':'pcscf','I-CSCF':'icscf','S-CSCF':'scscf','TAS':'tas','MGCF':'mgcf','HSS':'hss','MME':'mme','S-GW':'gw','P-GW':'gw','SGW':'gw','PGW':'gw','MSC':'msc','VLR':'msc','RNC':'rnc','NodeB':'nodeb','MGW':'mgw','GMSC':'gmsc','HLR':'hlr','AuC':'hlr','SGSN':'sgsn','GGSN':'ggsn','RU':'ru','AAU':'ru','RRU':'rru','DU':'du','gNB-DU':'du','CU-CP':'cucp','gNB-CU-CP':'cucp','CU-UP':'cuup','gNB-CU-UP':'cuup','NSSF':'nssf','NRF':'nrf'};
/* ----- callflow vắn tắt: c = các cột, s = [từ, tới, bản tin] ----- */
var FL={
 reg5g:{t:'Đăng ký thuê bao 5G (Registration)',c:['UE','gNB','AMF','AUSF','UDM'],s:[[0,1,'RRC Setup Request, Complete'],[1,2,'Initial UE Message (NAS)'],[2,3,'Nausf_UEAuthentication'],[3,4,'Nudm_UEAuthentication_Get'],[2,0,'Authentication, Security Mode'],[2,4,'Nudm_UECM_Registration'],[2,0,'Registration Accept']]},
 gnb:{t:'Truy cập vô tuyến và lập ngữ cảnh UE (SA)',c:['UE','gNB','AMF','UPF'],s:[[0,1,'PRACH preamble, RAR'],[0,1,'RRC Setup Request, Setup'],[1,2,'NGAP Initial UE Message'],[2,1,'Initial Context Setup Request'],[1,0,'RRC Reconfiguration (DRB)'],[1,3,'GTP-U trên N3: dữ liệu']]},
 pdu:{t:'Lập phiên PDU (PDU Session Establishment)',c:['UE','AMF','SMF','UPF','PCF'],s:[[0,1,'PDU Session Est. Request'],[1,2,'Nsmf_CreateSMContext'],[2,4,'Npcf_SMPolicyControl'],[2,3,'PFCP Session Establishment'],[2,1,'N1N2MessageTransfer'],[1,0,'PDU Session Est. Accept']]},
 udm:{t:'UDM và UDR: đăng ký nút phục vụ, hồ sơ',c:['AMF','UDM','UDR'],s:[[0,1,'Nudm_UECM_Registration'],[1,2,'Nudr_DM_Update'],[0,1,'Nudm_SDM_Get'],[1,2,'Nudr_DM_Query'],[1,0,'Hồ sơ thuê bao (AM, SM, SMS)']]},
 ausf:{t:'AUSF: xác thực 5G-AKA',c:['AMF','AUSF','UDM'],s:[[0,1,'Authenticate Request (SUCI)'],[1,2,'Nudm_UEAuthentication_Get'],[2,1,'HE AV (RAND, AUTN, XRES*)'],[1,0,'SE AV (RAND, AUTN, HXRES*)'],[0,1,'Confirmation (RES*)'],[1,0,'Kết quả, KSEAF']]},
 nrf:{t:'NRF: đăng ký và tìm NF',c:['UDM','NRF','AMF'],s:[[0,1,'NFRegister (profile UDM)'],[2,1,'NFDiscovery (tìm UDM)'],[1,2,'Danh sách UDM'],[2,0,'Gọi dịch vụ UDM (SBI)']]},
 nssf:{t:'NSSF: chọn lát cắt khi đăng ký',c:['UE','AMF','NSSF'],s:[[0,1,'Registration (Requested NSSAI)'],[1,2,'Nnssf_NSSelection_Get'],[2,1,'Allowed NSSAI, AMF set'],[1,0,'Registration Accept (NSSAI)']]},
 nef:{t:'NEF: mở sự kiện cho ứng dụng ngoài',c:['AF','NEF','UDM'],s:[[0,1,'Nnef_EventExposure Subscribe'],[1,2,'Nudm_EE_Subscribe'],[2,1,'Notify (sự kiện UE)'],[1,0,'Nnef Notify']]},
 nwdaf:{t:'NWDAF: phân tích dữ liệu mạng',c:['AMF','NWDAF'],s:[[0,1,'AnalyticsInfo_Request'],[1,0,'Analytics (tải, dự báo)'],[0,1,'EventsSubscription'],[1,0,'Notification']]},
 n3iwf:{t:'N3IWF: đăng ký qua Wi-Fi không tin cậy',c:['UE','N3IWF','AMF'],s:[[0,1,'IKE_SA_INIT, IKE_AUTH'],[1,2,'NGAP Initial UE Message'],[2,1,'Initial Context Setup'],[1,0,'Child SA (IPsec) cho NAS']]},
 smsf:{t:'SMSF: SMS qua NAS trên 5G',c:['UE','AMF','SMSF','SMSC'],s:[[0,1,'UL NAS Transport (SMS)'],[1,2,'Nsmsf_UplinkSMS'],[2,3,'MO-ForwardSM'],[3,2,'ACK'],[2,1,'Response'],[1,0,'DL NAS (CP-ACK)']]},
 sepp:{t:'SEPP: roaming 5G qua N32',c:['AMF khách','vSEPP','hSEPP','AUSF nhà'],s:[[0,1,'Nausf_Authenticate Request'],[1,2,'N32-f: bảo vệ tầng ứng dụng'],[2,3,'Nausf_UEAuthentication'],[3,2,'Response'],[2,1,'Response (đã ký)'],[1,0,'Response']]},
 chf:{t:'CHF và OCS: tính cước online',c:['SMF/P-GW','CHF/OCS'],s:[[0,1,'Create / CCR-I (xin hạn mức)'],[1,0,'Granted Units'],[0,1,'Update / CCR-U (hết hạn mức)'],[1,0,'Granted hoặc Final Unit'],[0,1,'Release / CCR-T (kết thúc)']]},
 mme:{t:'Attach 4G (EPS Attach)',c:['UE','eNB','MME','HSS','S-GW'],s:[[0,1,'RRC Setup, Attach Request'],[1,2,'S1AP Initial UE Message'],[2,3,'S6a AIR / AIA (vector)'],[2,0,'Authentication, Security Mode'],[2,3,'S6a ULR / ULA (hồ sơ)'],[2,4,'S11 Create Session Request'],[2,1,'Initial Context Setup, Attach Accept']]},
 sgw:{t:'Lập phiên và bearer mặc định (4G)',c:['MME','S-GW','P-GW','PCRF'],s:[[0,1,'S11 Create Session Request'],[1,2,'S5/S8 Create Session Request'],[2,3,'Gx CCR-I (xin luật PCC)'],[3,2,'Gx CCA-I'],[2,1,'Create Session Response (IP UE)'],[1,0,'Create Session Response']]},
 hss:{t:'HSS: xác thực, vị trí, IMS',c:['MME','HSS','S-CSCF'],s:[[0,1,'S6a AIR (xin vector)'],[1,0,'AIA (vector EPS-AKA)'],[0,1,'S6a ULR'],[1,0,'ULA (hồ sơ)'],[2,1,'Cx MAR (vector IMS-AKA)'],[1,2,'MAA']]},
 pcrf:{t:'PCRF: luật PCC cho thoại',c:['P-GW','PCRF','P-CSCF'],s:[[0,1,'Gx CCR-I (phiên ims)'],[1,0,'CCA-I (luật mặc định)'],[2,1,'Rx AAR (SDP: QCI 1)'],[1,0,'Gx RAR (cài luật GBR)'],[0,1,'Gx RAA'],[1,2,'Rx AAA']]},
 pcscf:{t:'P-CSCF và đăng ký IMS',c:['UE','P-CSCF','S-CSCF'],s:[[0,1,'REGISTER'],[1,2,'REGISTER (Mw)'],[2,1,'401 Unauthorized (AKA)'],[1,0,'401 + Security-Server'],[0,1,'REGISTER (IPsec)'],[2,0,'200 OK (qua P-CSCF)']]},
 icscf:{t:'I-CSCF: tìm S-CSCF cho thuê bao',c:['P-CSCF','I-CSCF','HSS','S-CSCF'],s:[[0,1,'REGISTER'],[1,2,'Cx UAR'],[2,1,'UAA (S-CSCF hoặc năng lực)'],[1,3,'REGISTER (tới S-CSCF)'],[3,0,'200 OK (theo Via)']]},
 scscf:{t:'S-CSCF: xác thực, tải hồ sơ, gọi AS',c:['P-CSCF','S-CSCF','HSS','TAS'],s:[[0,1,'REGISTER'],[1,2,'Cx MAR'],[2,1,'MAA (vector)'],[1,0,'401 Unauthorized'],[1,2,'Cx SAR'],[2,1,'SAA (hồ sơ, iFC)'],[1,3,'REGISTER bên thứ ba (ISC)'],[1,0,'200 OK']]},
 tas:{t:'TAS: dịch vụ thoại và tính cước',c:['S-CSCF','TAS','OCS'],s:[[0,1,'INVITE (ISC)'],[1,2,'Ro CCR-I (xin hạn mức)'],[2,1,'Ro CCA'],[1,0,'INVITE (tiếp tục)'],[1,2,'Ro CCR-T (gác máy)']]},
 mrf:{t:'MRF: phát thông báo, nhạc chờ',c:['UE','TAS','MRF'],s:[[1,2,'INVITE (Mr)'],[2,1,'200 OK'],[1,2,'ACK'],[2,0,'RTP: thông báo, nhạc chờ'],[1,2,'BYE (dừng phát)']]},
 ibcf:{t:'IBCF: nối IMS hai nhà mạng',c:['IMS A','IBCF','IMS B'],s:[[0,1,'INVITE (Mx)'],[1,2,'INVITE (Ici, ẩn topology)'],[2,1,'183 + SDP'],[1,0,'183 + SDP'],[2,0,'RTP qua TrGW']]},
 mgcf:{t:'MGCF: IMS sang mạng chuyển mạch kênh',c:['S-CSCF','MGCF','MGW','PSTN'],s:[[0,1,'INVITE (SIP)'],[1,2,'H.248 Add (điều khiển MGW)'],[1,3,'ISUP IAM'],[3,1,'ISUP ACM'],[1,0,'180 Ringing'],[3,1,'ISUP ANM'],[1,0,'200 OK']]},
 sbc:{t:'SBC: biên phiên và neo media',c:['UE','SBC','IMS'],s:[[0,1,'INVITE'],[1,2,'INVITE (che topology)'],[2,1,'183 + SDP'],[1,0,'183 (SDP của SBC)'],[0,1,'RTP'],[1,2,'RTP (neo media)']]},
 smsc:{t:'SMSC: tin nhắn từ máy gửi tới máy nhận',c:['UE A','MME / MSC','SMSC','UE B'],s:[[0,1,'NAS: CP-DATA (RP-DATA)'],[1,2,'MO-ForwardSM'],[2,1,'ACK'],[2,3,'MT-ForwardSM (sau SRI-SM)'],[3,2,'Báo giao (delivery report)']]},
 eir:{t:'EIR: kiểm tra IMEI',c:['MME / AMF','EIR'],s:[[0,1,'ME-Identity-Check-Request'],[1,0,'Equipment-Status: WHITELISTED']]},
 du:{t:'DU: lập lịch và chuyển tiếp dữ liệu',c:['RU','DU','CU'],s:[[0,1,'Fronthaul: IQ đường lên'],[1,2,'F1-U: GTP-U PDU'],[2,1,'F1-U: gói đường xuống'],[1,0,'Fronthaul: IQ đường xuống']]},
 cucp:{t:'CU-CP: điều phối lập ngữ cảnh UE',c:['DU','CU-CP','CU-UP','AMF'],s:[[0,1,'F1AP Initial UL RRC Message'],[1,3,'NGAP Initial UE Message'],[3,1,'Initial Context Setup Request'],[1,2,'E1AP Bearer Context Setup'],[1,0,'F1AP UE Context Setup'],[1,3,'Initial Context Setup Response']]},
 cuup:{t:'CU-UP: chuyển tiếp dữ liệu người dùng',c:['UPF','CU-UP','DU'],s:[[0,1,'N3 GTP-U (đường xuống)'],[1,2,'F1-U: NR-U DL data'],[2,1,'Phản hồi dữ liệu, lỗi mất gói'],[1,0,'N3 GTP-U (đường lên)']]},
 ru:{t:'RU: phát và thu sóng',c:['UE','RU','DU'],s:[[0,1,'Sóng đường lên (PUSCH)'],[1,2,'eCPRI: mẫu IQ'],[2,1,'eCPRI: IQ đường xuống'],[1,0,'Sóng đường xuống (PDSCH, SSB)']]},
 msc:{t:'MSC/VLR: cuộc gọi đi trên 3G',c:['UE','RNC','MSC','HLR'],s:[[0,1,'RRC Connection'],[1,2,'RANAP Initial UE (CM Service)'],[2,3,'MAP Send Auth Info'],[2,0,'Authentication, Ciphering'],[0,2,'CC SETUP'],[2,1,'RAB Assignment Request']]},
 hlr:{t:'HLR: cập nhật vị trí và tìm đường cuộc gọi',c:['VLR','HLR','GMSC'],s:[[0,1,'MAP Update Location'],[1,0,'Insert Subscriber Data'],[2,1,'MAP Send Routing Info'],[1,0,'Provide Roaming Number'],[0,1,'PRN ack (MSRN)'],[1,2,'SRI ack (MSRN)']]},
 gmsc:{t:'GMSC: cuộc gọi vào mạng',c:['Mạng khác','GMSC','HLR','MSC/VLR'],s:[[0,1,'ISUP IAM'],[1,2,'MAP SRI'],[2,3,'PRN, trả MSRN'],[2,1,'SRI ack (MSRN)'],[1,3,'ISUP IAM (tới MSRN)']]},
 pdp:{t:'Kích hoạt PDP context (3G)',c:['UE','SGSN','GGSN'],s:[[0,1,'Activate PDP Context Request'],[1,2,'GTPv1 Create PDP Context'],[2,1,'Response (IP của UE)'],[1,0,'Activate PDP Context Accept']]},
 rnc:{t:'RNC: lập kết nối RRC 3G',c:['UE','NodeB','RNC','MSC'],s:[[0,1,'RRC Connection Request'],[1,2,'Iub: khung dữ liệu lên'],[2,1,'NBAP Radio Link Setup'],[2,0,'RRC Connection Setup'],[2,3,'RANAP Initial UE Message']]},
 sip:{t:'SIP: lập phiên (INVITE)',c:['UE A','IMS','UE B'],s:[[0,1,'INVITE (SDP offer)'],[1,2,'INVITE'],[2,1,'180 Ringing'],[1,0,'180 Ringing'],[2,0,'200 OK (SDP answer)'],[0,2,'ACK']]},
 volte:{t:'Cuộc gọi VoLTE rút gọn',c:['UE A','IMS','UE B','PCRF'],s:[[0,1,'INVITE (bearer QCI 5)'],[1,2,'INVITE, 183 (SDP)'],[1,3,'Rx AAR, Gx RAR (QCI 1)'],[0,2,'PRACK, UPDATE'],[2,0,'180 Ringing, 200 OK'],[0,2,'RTP trên bearer QCI 1']]},
 srvcc:{t:'SRVCC: VoLTE chuyển xuống 3G',c:['UE','eNB','MME','MSC','IMS'],s:[[0,1,'Measurement Report (B1, A2)'],[1,2,'Handover Required (SRVCC)'],[2,3,'Sv: PS to CS Request'],[3,4,'INVITE (STN-SR): chuyển phiên'],[3,2,'Sv: Response'],[2,1,'Handover Command'],[1,0,'HO from E-UTRA (sang 3G)']]},
 csfb:{t:'CSFB: xuống 2G, 3G để gọi',c:['UE','eNB','MME','MSC'],s:[[0,1,'Extended Service Request'],[1,2,'S1AP (CS Fallback Indicator)'],[2,1,'UE Context Modification'],[1,0,'RRC Release (redirect 3G)'],[0,3,'CC SETUP (trên 3G)']]},
 rach:{t:'Truy cập ngẫu nhiên 4 bước',c:['UE','gNB'],s:[[0,1,'Msg1: PRACH preamble'],[1,0,'Msg2: RAR (TA, UL grant)'],[0,1,'Msg3: RRC Setup Request'],[1,0,'Msg4: RRC Setup (giải tranh chấp)']]},
 ho:{t:'Chuyển giao qua Xn',c:['UE','gNB nguồn','gNB đích','AMF'],s:[[0,1,'Measurement Report (A3)'],[1,2,'Xn Handover Request'],[2,1,'Handover Request Ack'],[1,0,'RRC Reconfiguration'],[0,2,'RACH, Reconfig Complete'],[2,3,'Path Switch Request (N2)']]},
 harq:{t:'HARQ: truyền lại khi lỗi',c:['gNB','UE'],s:[[0,1,'PDSCH (TB, NDI=1)'],[1,0,'PUCCH: NACK'],[0,1,'PDSCH gửi lại (RV khác)'],[1,0,'PUCCH: ACK']]}
};
var FLIAS={'UE':'reg5g','AMF':'reg5g','gNB':'gnb','eNB':'mme','SMF':'pdu','UPF':'pdu','PCF':'pdu','PFCP':'pdu','UDM':'udm','UDR':'udm','AUSF':'ausf','NRF':'nrf','NSSF':'nssf','NEF':'nef','NWDAF':'nwdaf','N3IWF':'n3iwf','SMSF':'smsf','SEPP':'sepp','N32':'sepp','CHF':'chf','OCS':'chf','MME':'mme','S-GW':'sgw','P-GW':'sgw','SGW':'sgw','PGW':'sgw','HSS':'hss','PCRF':'pcrf','Gx':'pcrf','Rx':'pcrf','P-CSCF':'pcscf','REGISTER':'pcscf','I-CSCF':'icscf','S-CSCF':'scscf','TAS':'tas','MTAS':'tas','MRF':'mrf','IBCF':'ibcf','TrGW':'ibcf','MGCF':'mgcf','IM-MGW':'mgcf','MGW':'mgcf','SBC':'sbc','SMSC':'smsc','IP-SM-GW':'smsc','EIR':'eir','DU':'du','gNB-DU':'du','CU-CP':'cucp','gNB-CU-CP':'cucp','CU-UP':'cuup','gNB-CU-UP':'cuup','RU':'ru','AAU':'ru','RRU':'ru','MSC':'msc','VLR':'msc','HLR':'hlr','AuC':'hlr','GMSC':'gmsc','SGSN':'pdp','GGSN':'pdp','RNC':'rnc','NodeB':'rnc','SIP':'sip','INVITE':'sip','SDP':'sip','ACK':'sip','PRACK':'sip','BYE':'sip','CANCEL':'sip','VoLTE':'volte','VoNR':'volte','IMS':'volte','SRVCC':'srvcc','eSRVCC':'srvcc','bSRVCC':'srvcc','aSRVCC':'srvcc','ATCF':'srvcc','STN-SR':'srvcc','CSFB':'csfb','SGs':'csfb','RACH':'rach','PRACH':'rach','HO':'ho','CHO':'ho','Xn':'ho','XnAP':'ho','HARQ':'harq','S6a':'hss','Cx':'hss','AIR':'hss','ULR':'hss','MAR':'hss','UAR':'icscf','SAR':'scscf','LIR':'icscf','Ro':'tas','Gy':'chf','N4':'pdu','N11':'pdu','N12':'ausf','N13':'ausf','N8':'udm','N35':'udm','N40':'chf','S11':'sgw','S5':'sgw','S8':'sgw','Iub':'rnc','Sv':'srvcc','Mr':'mrf','Mx':'ibcf','Mg':'mgcf','ISC':'tas'};

/* ----- nhận diện và bọc từ viết tắt ----- */
var keys=Object.keys(GL).sort(function(a,b){return b.length-a.length;});
var esc=function(s){return s.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&');};
var RE=new RegExp('('+keys.map(esc).join('|')+')(?:[12](?![0-9A-Za-z]))?(?![A-Za-z0-9_])(?!-[A-Za-z0-9])','g');
var EXC='script,style,textarea,input,select,option,button,pre,code,svg,a,summary,label,.gq,#gqcard,.nogl,[contenteditable],kbd,samp,[role=tab],[role=tablist],canvas,noscript,title,head,.mltabs';
var CONT='p,li,td,th,dd,dt,h1,h2,h3,h4,h5,figcaption,div';
var seenMap=new WeakMap();
function wrapText(tn){
  var s=tn.nodeValue;if(!s||s.length<2)return;
  var par=tn.parentElement;if(!par||par.closest(EXC))return;
  RE.lastIndex=0;var m,last=0,frag=null,cont=par.closest(CONT)||par,seen=seenMap.get(cont);
  while((m=RE.exec(s))){
    var off=m.index,k=m[1],pc=off>0?s.charAt(off-1):'';
    if(/[A-Za-z0-9_\-\.@]/.test(pc))continue;
    if(seen&&seen[k])continue;
    if(!seen){seen={};seenMap.set(cont,seen);}
    seen[k]=1;
    if(!frag)frag=document.createDocumentFragment();
    if(off>last)frag.appendChild(document.createTextNode(s.slice(last,off)));
    var sp=document.createElement('span');sp.className='gq';sp.setAttribute('data-g',k);sp.tabIndex=0;sp.textContent=m[0];
    frag.appendChild(sp);last=off+m[0].length;
  }
  if(!frag)return;
  if(last<s.length)frag.appendChild(document.createTextNode(s.slice(last)));
  tn.parentNode.replaceChild(frag,tn);
}
function scan(root){
  if(!root||!root.isConnected)return;
  if(root.nodeType===3){wrapText(root);return;}
  if(root.nodeType!==1||root.closest(EXC))return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),list=[],n;
  while((n=w.nextNode()))list.push(n);
  for(var i=0;i<list.length;i++)wrapText(list[i]);
}
var queue=[],tm=0,mo=null;
function flush(){
  tm=0;if(mo)mo.disconnect();
  var q=queue;queue=[];
  try{for(var i=0;i<q.length;i++)scan(q[i]);}catch(e){}
  if(mo)mo.observe(document.body,{childList:true,subtree:true});
}
function sched(){if(!tm)tm=setTimeout(flush,90);}
if(typeof MutationObserver!=='undefined'){
  mo=new MutationObserver(function(recs){
    for(var i=0;i<recs.length;i++){var a=recs[i].addedNodes;for(var j=0;j<a.length;j++){var n=a[j];if(n.nodeType===1||n.nodeType===3)queue.push(n);}}
    if(queue.length)sched();
  });
}

/* ----- thẻ chi tiết ----- */
var card=document.createElement('div');card.id='gqcard';card.setAttribute('role','tooltip');card.className='nogl';card.hidden=true;
document.body.appendChild(card);
var cur=null,anchor=null,hideT=0,showT=0,flowT=0;
var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
function h(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function trunc(s,n){s=String(s);return s.length>n?s.slice(0,n-1)+'…':s;}
function diagram(kind,title){
  var X=(typeof KBX!=='undefined'&&KBX[kind]&&KBX[kind].s)?KBX[kind].s:null,ifs=X&&X.ifs;if(!ifs||!ifs.length)return '';
  var L=ifs.slice(0,8),rows=Math.ceil(L.length/2),H=rows*44+16,cy=H/2,out='';
  out+='<line x1="190" y1="0" x2="190" y2="0" stroke="none"/>';
  L.forEach(function(r,i){
    var left=i%2===0,row=Math.floor(i/2),y=8+row*44+14,bx=left?6:272,ex=left?110:272,cx=left?150:230;
    out+='<line x1="'+ex+'" y1="'+y+'" x2="'+cx+'" y2="'+cy+'" class="gql"/>';
    out+='<rect x="'+bx+'" y="'+(y-14)+'" width="102" height="28" rx="6" class="gqb"/>';
    out+='<text x="'+(bx+51)+'" y="'+(y+4)+'" text-anchor="middle" class="gqt">'+h(trunc(r[1],17))+'</text>';
    var mx=(ex+cx)/2,my=(y+cy)/2;
    out+='<text x="'+mx+'" y="'+(my-3)+'" text-anchor="middle" class="gqi">'+h(trunc(r[0],14))+'</text>';
  });
  out+='<rect x="150" y="'+(cy-20)+'" width="80" height="40" rx="8" class="gqc"/><text x="190" y="'+(cy+5)+'" text-anchor="middle" class="gqct">'+h(trunc(title,11))+'</text>';
  return '<svg class="gqdg" viewBox="0 0 380 '+H+'" role="img" aria-label="Sơ đồ khối '+h(title)+' và các giao diện">'+out+'</svg>';
}
function flowSvg(f){
  var n=f.c.length,W=380,x=function(i){return n===1?190:34+i*((W-68)/(n-1));},steps=f.s,H=34+steps.length*26+8,out='';
  f.c.forEach(function(c,i){out+='<rect x="'+(x(i)-33)+'" y="3" width="66" height="20" rx="5" class="gqb"/><text x="'+x(i)+'" y="17" text-anchor="middle" class="gqt">'+h(trunc(c,11))+'</text><line x1="'+x(i)+'" y1="23" x2="'+x(i)+'" y2="'+(H-4)+'" class="gqf"/>';});
  steps.forEach(function(s,i){
    var y=44+i*26,xf=x(s[0]),xt=x(s[1]),dir=xt>xf?1:-1,len=Math.abs(xt-xf)||1,mx=Math.min(Math.max((xf+xt)/2,70),W-70);
    out+='<g class="gqs" data-i="'+i+'"><line x1="'+xf+'" y1="'+y+'" x2="'+(xt-dir*5)+'" y2="'+y+'" class="gqar" style="--len:'+len+'"/><path d="M'+xt+' '+y+' l'+(-dir*7)+' -3.5 l0 7 z" class="gqah"/><text x="'+mx+'" y="'+(y-5)+'" text-anchor="middle" class="gqm">'+h(s[2])+'</text></g>';
  });
  return '<svg class="gqfl" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Callflow vắn tắt: '+h(f.t)+'">'+out+'</svg>';
}
function startFlow(){
  clearInterval(flowT);flowT=0;
  var gs=card.querySelectorAll('.gqs');if(!gs.length)return;
  if(reduce){for(var i=0;i<gs.length;i++)gs[i].classList.add('on');return;}
  var idx=-1,n=gs.length;
  function tick(){
    idx++;
    if(idx>n+1){idx=-1;for(var i=0;i<n;i++)gs[i].classList.remove('on','cur');return;}
    for(var i=0;i<n;i++){gs[i].classList.toggle('on',i<=idx);gs[i].classList.toggle('cur',i===idx);}
  }
  tick();flowT=setInterval(tick,850);
}
function build(k){
  var g=GL[k];if(!g)return '';
  var kind=KIND[k],kb=(kind&&typeof KB!=='undefined')?KB[kind]:null,fk=FLIAS[k],fl=fk?FL[fk]:null,o='';
  o+='<div class="gqhd"><b>'+h(k)+'</b><span class="gqe">'+h(g.en)+'</span></div><div class="gqvi">'+h(g.vi)+'</div>';
  if(kb){
    o+='<p class="gqrole">'+h(kb.r||'')+'</p>';
    var fs=(kb.f||[]).filter(function(f){return f[1];}).slice(0,4);
    if(fs.length)o+='<ul class="gqfn">'+fs.map(function(f){return '<li><b>'+h(f[0].replace(/\.$/,''))+'.</b> '+h(f[1])+'</li>';}).join('')+'</ul>';
    var dg=diagram(kind,k);if(dg)o+='<div class="gqsec">Khối và các giao diện</div>'+dg;
  }
  if(fl)o+='<div class="gqsec">Callflow vắn tắt: '+h(fl.t)+'</div>'+flowSvg(fl);
  return o;
}
function place(){
  if(!anchor||!anchor.isConnected){hide();return;}
  var r=anchor.getBoundingClientRect(),vw=document.documentElement.clientWidth,vh=window.innerHeight;
  card.style.maxWidth=Math.min(440,vw-16)+'px';
  var cw=card.offsetWidth,ch=card.offsetHeight,x=Math.min(Math.max(8,r.left),vw-cw-8),y=r.bottom+6;
  if(y+ch>vh-8){var up=r.top-ch-6;y=up>=8?up:Math.max(8,vh-ch-8);}
  card.style.left=x+'px';card.style.top=y+'px';
}
var lastShow=0;
function show(el,k){
  clearTimeout(hideT);clearTimeout(showT);lastShow=Date.now();
  if(cur===k&&anchor===el&&!card.hidden){return;}
  var html=build(k);if(!html)return;
  cur=k;anchor=el;card.innerHTML=html;card.hidden=false;card.style.visibility='hidden';
  place();card.style.visibility='';startFlow();
}
function hide(){clearTimeout(hideT);clearTimeout(showT);card.hidden=true;cur=null;anchor=null;clearInterval(flowT);flowT=0;}
function later(){clearTimeout(hideT);hideT=setTimeout(hide,260);}
var canHover=false;try{canHover=window.matchMedia('(hover: hover)').matches;}catch(e){}
function svgKey(t){
  t=(t||'').trim();if(!t||t.length>40)return null;
  if(GL[t])return t;
  var parts=t.split(/[\s\/,()·:]+/),i;for(i=0;i<parts.length;i++)if(GL[parts[i]])return parts[i];
  return null;
}
document.addEventListener('mouseover',function(e){
  if(!canHover)return;
  var t=e.target;if(!t||!t.closest)return;
  if(t.closest('#gqcard')){clearTimeout(hideT);return;}
  var g=t.closest('.gq');
  if(g){clearTimeout(hideT);var k=g.getAttribute('data-g');clearTimeout(showT);showT=setTimeout(function(){show(g,k);},140);return;}
  var tx=t.closest('svg text');
  if(tx&&!tx.closest('#gqcard')){var k2=svgKey(tx.textContent);if(k2){clearTimeout(hideT);clearTimeout(showT);showT=setTimeout(function(){show(tx,k2);},220);return;}}
  clearTimeout(showT);if(!card.hidden)later();
});
document.addEventListener('click',function(e){
  var t=e.target;if(!t||!t.closest)return;
  if(t.closest('#gqcard'))return;
  var g=t.closest('.gq');
  if(g){var k=g.getAttribute('data-g');if(!card.hidden&&anchor===g&&Date.now()-lastShow>500){hide();}else{show(g,k);}return;}
  if(!card.hidden)hide();
},true);
document.addEventListener('focusin',function(e){var g=e.target&&e.target.closest&&e.target.closest('.gq');if(g)show(g,g.getAttribute('data-g'));});
document.addEventListener('focusout',function(e){var g=e.target&&e.target.closest&&e.target.closest('.gq');if(g)later();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!card.hidden)hide();});
window.addEventListener('scroll',function(){if(!card.hidden)place();},true);
window.addEventListener('resize',function(){if(!card.hidden)place();});
card.addEventListener('mouseenter',function(){clearTimeout(hideT);});
card.addEventListener('mouseleave',function(){later();});

/* ----- khởi động ----- */
function init(){
  try{scan(document.body);}catch(e){}
  if(mo)mo.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,60);});else setTimeout(init,60);
window.__GLX={GL:GL,FL:FL,KIND:KIND,FLIAS:FLIAS,scan:scan,build:build};
})();

