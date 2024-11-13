function bubblingPrevention(event) {
  event.stopPropagation();
  console.log('Bubbling is prevented');
}