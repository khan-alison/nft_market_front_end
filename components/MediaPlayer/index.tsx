import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';

import PlayIcon from 'public/svg/play_icon.svg';
import VolumeIcon from 'public/svg/volume_icon.svg';
import PauseIcon from 'public/svg/pause_icon.svg';
import MuteIcon from 'public/svg/mute_icon.svg';
import FullScreenIcon from 'public/svg/full_screen_icon.svg';

import styles from './styles.module.scss';

type MediaPlayerProps = {
  src: any;
  controllerClassName?: any;
  isVideo?: boolean;
  videoClassName?: any;
  wrapperClassName?: any;
};

const MediaPlayer = ({
  src,
  controllerClassName,
  isVideo = true,
  videoClassName,
  wrapperClassName,
}: MediaPlayerProps) => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // references
  const audioPlayer = useRef<any>(); // reference our audio component
  const progressBar = useRef<any>() as any; // reference our progress bar
  const animationRef = useRef<any>(); // reference the animation

  const calculateTime = (secs: any) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };
  const remainTime = calculateTime(duration - currentTime);
  const playTime = calculateTime(currentTime);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      // cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (progressBar?.current?.value) {
      progressBar.current.value = audioPlayer?.current?.currentTime;
    }

    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar?.current?.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    const percentage = (progressBar?.current?.value / duration) * 100;
    progressBar?.current?.style?.setProperty('--seek-before-width', `${percentage}%`);
    setCurrentTime(progressBar?.current?.value);
  };

  const toggleMute = () => {
    setIsMuted((state) => !state);
  };

  const openFullscreen = () => {
    if (audioPlayer?.current?.requestFullscreen) {
      audioPlayer?.current?.requestFullscreen();
      audioPlayer.current.onfullscreenchange = () => (audioPlayer.current.muted = isMuted);
    } else if (audioPlayer?.current?.webkitRequestFullscreen) {
      /* Safari */
      audioPlayer?.current?.webkitRequestFullscreen();
    } else if (audioPlayer?.current?.msRequestFullscreen) {
      /* IE11 */
      audioPlayer?.current?.msRequestFullscreen();
    }
  };
  useEffect(() => {
    const setAudioData = () => {
      const seconds = audioPlayer?.current?.duration;
      setDuration(Math.floor(seconds));
      progressBar.current.max = seconds;
    };

    setAudioData();
    audioPlayer?.current?.addEventListener('loadeddata', setAudioData);

    return () => {
      audioPlayer?.current?.removeEventListener('loadeddata', setAudioData);
      setDuration(0);
    };
  }, [audioPlayer]);

  useEffect(() => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }, [duration]);

  const handleOnEnded = () => setIsPlaying(false);

  return (
    <div className={cx(styles.audioPlayer, wrapperClassName)}>
      <div className={styles.audioContainer}>
        <video
          onClick={togglePlayPause}
          className={cx(styles.video, videoClassName)}
          ref={audioPlayer}
          src={src}
          muted={isMuted}
          preload='metadata'
          controlsList='nodownload'
          loop={true}
          onEnded={handleOnEnded}
        />
      </div>

      <div className={cx(styles.controller, controllerClassName)}>
        <button onClick={togglePlayPause} className={cx(styles.playPause, styles.button)}>
          <img src={isPlaying ? PauseIcon : PlayIcon} className={styles.play} />
        </button>
        <div className={styles['progress-wrap']}>
          <input
            type='range'
            className={styles.progressBar}
            defaultValue='0'
            ref={progressBar}
            onChange={changeRange}
          />
        </div>
        <div className={styles.duration}>
          {duration && !isNaN(duration) && duration !== Infinity ? remainTime : playTime}
        </div>
        <button className={cx(styles.mute, styles.button)} onClick={toggleMute}>
          <img src={isMuted ? MuteIcon : VolumeIcon} />
        </button>
        {isVideo && (
          <button onClick={openFullscreen} className={cx(styles['full-screen'], styles.button)}>
            <img src={FullScreenIcon} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaPlayer;
