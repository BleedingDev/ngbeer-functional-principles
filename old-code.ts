this.route.queryParams.subscribe((route: { playlistId: string; clipId: string }) => {
  this.clip$ = this.store.pipe(
    select($playlistsClip(route.playlistId, currentRoute.clipId))
  );

  this.clip$.subscribe((currentClip: Clip | null) => {
    if (currentClip != null) {
      this.recording$ = this.store.pipe(select($recording(currentClip.recordingId)));

      this.recording$.subscribe((currentRecording: Recording | null) => {
        if (currentRecording != null) {
          this.store.dispatch(new ChangeCurrentVideo(currentRecording.videos[0]));

          if (currentRecording.videos) {
            this.store.pipe(select($currentVideo)).subscribe((currentVideo: Video) => {
              // Some work with current video
            });
          }
        }
      });
    }
  });
});
