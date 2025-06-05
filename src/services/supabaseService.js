/**
 * Supabase Service - Database operations for YoYo Fitness Test
 * Refactored from scripts/supabase-config.js
 */

// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://qfngdawbbzisdwqvogxs.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbmdkYXdiYnppc2R3cXZvZ3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDc2MzMsImV4cCI6MjA2NDE4MzYzM30.wrBZ8lfn2dNmOlX8v4mTJ1eaTcYzC7SUKb0tmhzqsIU'
};

// Initialize Supabase client (will be available globally)
let supabaseClient;

// Initialize Supabase when the script loads
export function initializeSupabase() {
    console.log("🗄️ Initializing Supabase Service...");
    
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        const { createClient } = supabase;
        supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        console.log('✅ Supabase client initialized successfully');
        return supabaseClient;
    } else {
        console.error('❌ Supabase SDK not loaded. Make sure to include the Supabase script before this file.');
        return null;
    }
}

// YoYo Database Helper Functions
export const YoYoDatabase = {

    /**
     * Save or update athlete YoYo test data
     */
    async saveAthleteData(athleteName, distance, warningState, sessionName = 'Default Session') {
        if (!supabaseClient) {
            console.error('Supabase client not initialized');
            return false;
        }

        try {
            const { data, error } = await supabaseClient
                .from('yoyo_sessions')
                .upsert({
                    athlete_name: athleteName,
                    distance_meters: parseInt(distance),
                    warning_state: warningState,
                    session_name: sessionName
                }, {
                    onConflict: 'athlete_name,session_name'
                });

            if (error) {
                console.error('Error saving athlete data:', error);
                return false;
            }

            console.log('Athlete data saved successfully:', athleteName, distance + 'm', 'State:', warningState);
            return true;
        } catch (error) {
            console.error('Error saving athlete data:', error);
            return false;
        }
    },

    /**
     * Load all data for a specific session
     */
    async loadSessionData(sessionName) {
        if (!supabaseClient) {
            console.error('Supabase client not initialized');
            return null;
        }

        try {
            const { data, error } = await supabaseClient
                .from('yoyo_sessions')
                .select('*')
                .eq('session_name', sessionName)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading session data:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error loading session data:', error);
            return null;
        }
    },

    /**
     * Get all unique session names
     */
    async getAllSessions() {
        if (!supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        try {
            const { data, error } = await supabaseClient
                .from('yoyo_sessions')
                .select('session_name, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading sessions:', error);
                return [];
            }

            // Get unique session names
            const uniqueSessions = [...new Set(data.map(item => item.session_name))];
            return uniqueSessions;
        } catch (error) {
            console.error('Error loading sessions:', error);
            return [];
        }
    },

    /**
     * Get eliminated players (warning_state = 2) for a session, sorted by distance
     */
    async getSessionRankings(sessionName) {
        if (!supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        try {
            const { data, error } = await supabaseClient
                .from('yoyo_sessions')
                .select('*')
                .eq('session_name', sessionName)
                .eq('warning_state', 2)
                .order('distance_meters', { ascending: false });

            if (error) {
                console.error('Error loading session rankings:', error);
                return [];
            }

            return data;
        } catch (error) {
            console.error('Error loading session rankings:', error);
            return [];
        }
    },

    /**
     * Delete all data for a specific session
     */
    async deleteSession(sessionName) {
        if (!supabaseClient) {
            console.error('Supabase client not initialized');
            return false;
        }

        try {
            const { error } = await supabaseClient
                .from('yoyo_sessions')
                .delete()
                .eq('session_name', sessionName);

            if (error) {
                console.error('Error deleting session:', error);
                return false;
            }

            console.log('Session deleted successfully:', sessionName);
            return true;
        } catch (error) {
            console.error('Error deleting session:', error);
            return false;
        }
    },

    /**
     * Get statistics for all sessions
     */
    async getOverallStats() {
        if (!supabaseClient) {
            console.error('Supabase client not initialized');
            return null;
        }

        try {
            const { data, error } = await supabaseClient
                .from('yoyo_sessions')
                .select('athlete_name, distance_meters, warning_state, session_name');

            if (error) {
                console.error('Error loading overall stats:', error);
                return null;
            }

            // Calculate statistics
            const stats = {
                totalSessions: [...new Set(data.map(item => item.session_name))].length,
                totalAthletes: [...new Set(data.map(item => item.athlete_name))].length,
                totalTests: data.length,
                averageDistance: data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.distance_meters, 0) / data.length) : 0,
                maxDistance: data.length > 0 ? Math.max(...data.map(item => item.distance_meters)) : 0,
                eliminatedCount: data.filter(item => item.warning_state === 2).length
            };

            return stats;
        } catch (error) {
            console.error('Error calculating overall stats:', error);
            return null;
        }
    },

    /**
     * Reset entire database - DELETE ALL DATA
     * WARNING: This is a destructive operation!
     */
    async resetAllData() {
        if (!supabaseClient) {
            console.error('Supabase client not initialized');
            return false;
        }

        try {
            const { error } = await supabaseClient
                .from('yoyo_sessions')
                .delete()
                .neq('id', 0); // This will delete all rows since id is never 0

            if (error) {
                console.error('Error resetting database:', error);
                return false;
            }

            console.log('Database reset successfully - all YoYo data deleted');
            return true;
        } catch (error) {
            console.error('Error resetting database:', error);
            return false;
        }
    }
};

// Export configuration for external use
export { SUPABASE_CONFIG };

// Auto-initialize when imported
export function initSupabaseService() {
    // Small delay to ensure Supabase SDK is loaded
    setTimeout(() => {
        initializeSupabase();
    }, 100);
}
