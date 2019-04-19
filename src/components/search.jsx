import AlgoliaPlaces from 'algolia-places-react';
 
export default () => {
  return (
    <AlgoliaPlaces
      placeholder='Write an address here'
 
      options={{
        appId: 'my-app-id',
        apiKey: 'sharing-is-caring',
        language: 'sv',
        countries: ['se'],
        type: 'city',
        // Other options from https://community.algolia.com/places/documentation.html#options
      }}
 
      onChange={({ query, rawAnswer, suggestion, suggestionIndex }) => 
     //Fired when suggestion selected in the dropdown or hint was validated.
 
      onSuggestions={({ rawAnswer, query, suggestions }) => 
   //Fired when dropdown receives suggestions. You will receive the array of suggestions that are displayed.
 
      onCursorChanged={({ rawAnswer, query, suggestion, suggestonIndex }) => 
     //Fired when arrows keys are used to navigate suggestions.')}
 
      onClear={() => 
    //Fired when the input is cleared.')}
 
      onLimit={({ message }) => 
     //Fired when you reached your current rate limit.
 
      onError={({ message }) => 
     //Fired when we could not make the request to Algolia Places servers for any reason but reaching your rate limit.
    />
  );  
}