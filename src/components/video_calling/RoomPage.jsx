import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const RoomPage = () => {
    const { roomId } = useParams();
    const meetingRef = useRef(null);

    useEffect(() => {
   
        const appID = parseInt(import.meta.env.VITE_ZEGOCLOUD_APP_ID, 10);
        const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;
        


        console.log("App ID:", appID);
        console.log("Server Secret:", serverSecret);
        console.log("Room ID:", roomId);

        if (meetingRef.current && appID && serverSecret && roomId) {
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId,
                Date.now().toString(),
                "MindLink"
            );

            console.log("Kit Token:", kitToken);

            const zc = ZegoUIKitPrebuilt.create(kitToken);
            zc.joinRoom({
                container: meetingRef.current,
                sharedLinks: [
                    {
                        name: 'Copy Link',
                        url: `https://localhost:3000/Room/${roomId}`,
                    }
                ],
                scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
                showScreenSharingButton: true,
                showLeaveRoomConfirmDialog: true,
                showChatButton: true,
                enableRaiseHandFeature: true,
                showParticipantList: true,
                enableMuteAllButton: true,
                showMeetingTimer: true,
                enableVirtualBackgrounds: true,
                enableBreakoutRooms: true,
                showRecordingButton: true,
                showFullScreenButton: true,
                enableWaitingRoom: true,
                allowParticipantReactions: true,
                enableLowBandwidthMode: true,
                showPinnedVideoButton: true,
                enableNoiseSuppression: true,
                allowHostToRemoveParticipants: true,
                showNetworkStatusIndicator: true,
                showEndCallButton: true,
                enableLiveTranscription: true,
                enableAutoRecording: false,
                showShareLinkButton: true,
                enableBlurBackground: true,
                allowParticipantCameraToggle: true,
                allowParticipantMicrophoneToggle: true,
                allowHostScreenSharingOnly: false,
            });
        } else {
            console.error("Zego initialization failed. Check App ID, Server Secret, and Room ID.");
        }
    }, [roomId]);

    return (
        <div>
            <div ref={meetingRef} style={{ width: "100%", height: "100vh" }} />
        </div>
    );
};

export default RoomPage;
