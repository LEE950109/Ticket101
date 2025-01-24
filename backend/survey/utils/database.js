const dynamoClient = require('./dynamoClients');


class Database {
  constructor() {
    this.preferencesTable = 'SurveyTable';
    this.artistsTable = 'ArtistsTable';
    this.moviesTable = 'MoviesTable';
    this.performancesTable = 'PerformancesTable';
  }

  async savePreferences(preferences) {
    const params = {
      TableName: this.preferencesTable,
      Item: preferences,
    };

    try {
      await dynamoClient.put(params).promise();
      return { success: true, message: 'Preferences saved successfully' };
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  async searchArtists(query) {
    const params = {
      TableName: this.artistsTable,
      FilterExpression: 'contains(artist_name, :query)',
      ExpressionAttributeValues: {
        ':query': query,
      },
    };

    try {
      const result = await dynamoClient.scan(params).promise();
      return result.Items || [];
    } catch (error) {
      console.error('Error searching artists:', error);
      throw error;
    }
  }

  async searchMovies(query) {
    const params = {
      TableName: this.moviesTable,
      FilterExpression: 'contains(title, :query)',
      ExpressionAttributeValues: {
        ':query': query,
      },
    };

    try {
      const result = await dynamoClient.scan(params).promise();
      return result.Items || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  async savePerformance(performance) {
    const params = {
      TableName: this.performancesTable,
      Item: performance,
    };

    try {
      await dynamoClient.put(params).promise();
      return { success: true, message: 'Performance saved successfully' };
    } catch (error) {
      console.error('Error saving performance:', error);
      throw error;
    }
  }
}

module.exports = Database;
