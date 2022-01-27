import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, VolumeUpIcon, SwitchHorizontalIcon } from "@heroicons/react/solid";
import _, { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import swal from 'sweetalert';

function Player() {
    const spotifyApi = useSpotify();
    const songInfo = useSongInfo();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);
    const [toggleShuffle, setToggleShuffle] = useState(false)
    const initialState = ["track", "context", "off"];
    const [repeat, setRepeat] = useState(initialState[0])
    const [roundRobin, setRoundRobin] = useState(0)

    const fetchCurrentSong = () => {
        if (_.isEmpty(songInfo)) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now playing: " + data.body?.item);
                setCurrentIdTrack(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                }, function (err) {
                    swal({
                        title: err.body.error.reason,
                        text: err.body.error.message,
                        icon: "error"
                    });
                })
            }, function (err) {
                swal({
                    title: err.body.error.reason,
                    text: err.body.error.message,
                    icon: "error"
                });
            })
        }
    }

    const handleShuffle = () => {
        setToggleShuffle(!toggleShuffle)
        spotifyApi.setShuffle(toggleShuffle)
            .then(function () {
                if (toggleShuffle) {
                    console.log('Shuffle is on.');
                } else {
                    console.log('Shuffle is off.');
                }
            }, function (err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
            });
    }

    const handleRepeat = () => {
        setRoundRobin(roundRobin + 1)
        if (roundRobin >= 2) {
            setRoundRobin(0)
        }
        spotifyApi.setRepeat(initialState[roundRobin])
            .then(function () {
                if (initialState[roundRobin] == 'track') {
                    setRepeat(initialState[roundRobin])
                    console.log('Repeat track.');
                } else if (initialState[roundRobin] == 'context') {
                    setRepeat(initialState[roundRobin])
                    console.log('Repeat context.');
                } else if (initialState[roundRobin] == 'off') {
                    setRepeat(initialState[roundRobin])
                    console.log('Repeat off.');
                } else {
                    console.log('Something went wrong!');
                }
            }, function (err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
            });
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body && data.body.is_playing) {
                console.log("User is currently playing something!");
                spotifyApi.pause()
                    .then(function () {
                        console.log('Playback paused');
                    }, function (err) {
                        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                        swal({
                            title: err.body.error.reason,
                            text: err.body.error.message,
                            icon: "error"
                        });
                    });
                setIsPlaying(false);
            } else {
                console.log("User is not playing anything, or doing so in private.");
                spotifyApi.play()
                    .then(function () {
                        console.log('Playback started');
                    }, function (err) {
                        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                        swal({
                            title: err.body.error.reason,
                            text: err.body.error.message,
                            icon: "error"
                        });
                    });
                setIsPlaying(true);
            }
        }, function (err) {
            swal({
                title: err.body.error.reason,
                text: err.body.error.message,
                icon: "error"
            });
        });
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            //fetch the song information
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackIdState, spotifyApi, session])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debounceAdjustVolume(volume);
        }
    }, [volume])

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => { });
        }, 500),
        []
    )

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4 ">
                <img
                    className="hidden md:inline h-10 w-10"
                    src={songInfo?.album?.images?.[0]?.url}
                    alt=""
                />
                <div>
                    <h3>
                        {songInfo?.name}
                    </h3>
                    <p>
                        {songInfo?.artists?.[0]?.name}
                    </p>
                </div>
            </div>
            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon
                    className={`button ${toggleShuffle ? ("text-white") : ("text-green-500")}`}
                    onClick={handleShuffle}
                />
                <RewindIcon
                    className="button"
                    onClick={() => spotifyApi.skipToPrevious()} //not worked
                />
                {isPlaying ? (
                    <PauseIcon
                        className="button w-10 h-10"
                        onClick={handlePlayPause}
                    />
                ) : (
                    <PlayIcon
                        className="button w-10 h-10"
                        onClick={handlePlayPause}
                    />
                )}

                <FastForwardIcon
                    className="button"
                    onClick={() => spotifyApi.skipToNext()} //not worked
                />
                <ReplyIcon
                    className={`button ${repeat == 'track' ? ("text-green-500 ") : repeat == 'context' ? ("text-blue-500") : repeat == 'off' ? ("text-white") : ("text-white")}`}
                    onClick={handleRepeat}
                >
                    <span className={`${initialState[roundRobin] == 'track' ? ("inline-block w-10 h-10 mr-2 bg-red-600 rounded-full") : ("hidden")}`}>1</span>
                </ReplyIcon>
                
            </div>
            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon
                    className="button"
                    onClick={() => volume > 0 && setVolume(volume - 10)}
                />
                <input
                    type="range"
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-14 md:w-28"
                />
                <VolumeUpIcon
                    className="button"
                    onClick={() => volume < 100 && setVolume(volume + 10)}
                />
            </div>
        </div>
    );
}

export default Player;
