this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe((currentRoute: { playlistId: string; clipId: string }) => {
  this.playlist$ = this.store.pipe(select($playlist(currentRoute.playlistId)));
  this.clips$ = this.store.pipe(select($playlistAnotations(currentRoute.playlistId)));
  this.clip$ = this.store.pipe(select($playlistsClip(currentRoute.playlistId, currentRoute.clipId)));
  this.playlist$.pipe(takeUntil(this.unsubscribe$)).subscribe((playlist: Playlist) => {
    this.currentPlaylist = playlist;
  });

  this.clip$.pipe(takeUntil(this.unsubscribe$)).subscribe((currentClip: Clip | null) => {
    if (currentClip != null) {
      this.currentClip = currentClip;
      this.recording$ = this.store.pipe(select($recordingEntity(currentClip.recordingId)));

      this.recording$.pipe(takeUntil(this.unsubscribe$)).subscribe((currentRecording: Recording | null) => {
        if (currentRecording != null) {
          this.currentRecording = currentRecording;
          this.recordingVideos$ = this.store.pipe(select($recordingVideos(currentRecording.id)));
          this.store.dispatch(new ChangeCurrentVideo(currentRecording.videos[0]));

          if (currentRecording.videos) {
            this.store
              .pipe(
                takeUntil(this.unsubscribe$),
                select($currentVideo)
              )
              .subscribe((currentVideo: Video) => {
                this.currentVideo = currentVideo;
                this.calcClipValue = this.calculateTagDuration(currentClip, currentVideo);
              });
          }
        }
      });
    }
  });
});
