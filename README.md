# Learn-WebRTC

## Understanding UDP transport and real-time transfer 
- Real-time transfer of data thì cần phải fast connection speed => việc cập nhật data xảy ra liên tục, có thể hao hụt hoặc thiếu sót dữ liệu. 
- **User Datagram Protocol (UDP)** sẽ là lựa chọn tốt đối với WebRPT applications => dealing with high-performance 
    - It does not guarantee the order your data is sent in or the order in which it will arrive on the other side 
    - It does not guarantee that every packet of data will make it to the other side; some may get lost along the way 
    - It doest not track the state of every single data packet and will continue to send data event if data has been lost by the other client

- **Transmission Control Protocol (TCP)** được sử dụng nhiều ngày nay vì: 
    - Any data sent will be acknowledged as received
    - Any data that does not make it to the other side will get resent and halt the sending of any more data
    - Data will be unique and no data will be duplicated on the other side

## The WebRTC API 
1. The RTCPeerConnection object
    - allow us initialize connection, connect to peers, and attach media stream information. 
    - maintain the session and state of a peer connection in the browser => handles setup and creation of a peer connection => encapsulates all of these things and exposes a set of events that get fired at key points in the connection process
![RTCConnection](https://scontent.fbmv1-1.fna.fbcdn.net/v/t1.15752-9/341935081_123818737348023_3054149264796479564_n.png?_nc_cat=107&ccb=1-7&_nc_sid=ae9488&_nc_ohc=dUiaJCScRT8AX_b3-oe&_nc_ht=scontent.fbmv1-1.fna&oh=03_AdTzQRlk1Ab8a9Fq0hgh8ZxDDJGg1mjVXaryojSvcg7upA&oe=646DBFF6)
        ```js
        var myConnection = new RTCConnection(configuration);
        myConnection.onaddstream = function(stream) {
            //Use stream here
        }
        ```
2. Signaling and negotiation 
    - connecting to another browser => finding where that other browser is located on the Web 
    - Based on IP address and port number, which act as a street address to navigate to your destination
    - Việc mà finding, và connect nhau sau đó communicate với nhau => this process trong **WebRTC** là signaling and negotiation
    - The process of signaling consists of a few steps: 
        1. Generate a list of potential candidates for a peer connection 
        2. Either the user or a compoter algorithm will select a user to make a connection with 
        3. The signaling layer will notify that user that someone would like to connect with him/her, and he/she can accept or decline.
        4. The first user is notified of the acceptance of the offer to connect.
        5. If accepted, the first user will initiate *RTCPeerConnection* with the other user.
        6. Both the users will exchange hardware and software information about their computers over the signaling channel.
        7. Both users also will exchange location information about their computer over the signaling channel
        8. The connection will either succeed or fail between the users. 
3. Session description protocol 
    - Tại sao nó xuất hiện: để get connected with another user bạn cần biết một vài thông tin như là: audio and video codecs support là gì?, network như thế nào? bao nhiêu data máy tính có thể xử lý?
    - The SDP is a string-based data blob provided by the browser => the format of this string is a set of key-value pairs
    ```js
    <key>=<value>\n
    ```
    `key`: is a single character that establishes the type of value this is.
    `value`: is structured set of text that comprises a machine-readable configuration value 
    - The difference key-value pairs are then split by line breaks 
    - The SDP will cover the description, timing configuration, and media constraints for given user
    - Được đưa trong quá trình thiết lập kết nối với user khác 
    - nó giống như một business card để computer của bạn có thể kết nối với other user
4. Finding a clear route to another user 
    - Session Traversal Utilities for NAT (STUN)
        - là bước đầu tiên tìm kiếm good connection between two peers. 
    - Traversal Using Relays around NAT(TURN)
    - Interactive Connectivity Establishment(ICE)
    ![visualize how the layout of a typical WebRTC connection process looks like](https://scontent.fbmv1-1.fna.fbcdn.net/v/t1.15752-9/342210549_1270428673871372_1242750448622378645_n.png?_nc_cat=110&ccb=1-7&_nc_sid=ae9488&_nc_ohc=3riW-auX_I0AX-72KG6&_nc_ht=scontent.fbmv1-1.fna&oh=03_AdRTiGUHI3YubMPFPo1tziyUBxqh22uz_ooi-68jujJpZA&oe=646E1371)
## Strategies for group calls
    - Mesh multiple direct connections
    - MCU multipoint control units 
    - SFU selective forwarding units 
    
