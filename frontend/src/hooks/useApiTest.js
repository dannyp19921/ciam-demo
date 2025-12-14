// frontend/src/hooks/useApiTest.js
// Custom hook for API endpoint testing
// Used in LoginScreen and ApiTestScreen

import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { API_BASE_URL } from '../constants/config';

/**
 * Hook for testing API endpoints
 * Handles loading state, results, and error handling
 * @param {string|null} accessToken - Optional access token for authenticated requests
 * @returns {Object} - API test state and handlers
 */
export function useApiTest(accessToken = null) {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Call public endpoint (no auth required)
   */
  const callPublic = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiService.callPublic();
      setResult({
        endpoint: '/public',
        success: true,
        authenticated: false,
        data,
      });
    } catch (error) {
      setResult({
        endpoint: '/public',
        success: false,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Call protected endpoint (requires auth)
   * Behavior differs based on whether accessToken is provided
   */
  const callProtected = useCallback(async () => {
    setIsLoading(true);
    try {
      if (accessToken) {
        // Authenticated request
        const data = await apiService.callProtected(accessToken);
        setResult({
          endpoint: '/protected',
          success: true,
          authenticated: true,
          data,
        });
      } else {
        // Unauthenticated request - expect 401
        const response = await fetch(`${API_BASE_URL}/protected`);
        if (response.status === 401) {
          setResult({
            endpoint: '/protected',
            success: false,
            error: '401 Unauthorized - Krever innlogging!',
            expectedBehavior: true,
          });
        } else {
          const data = await response.json();
          setResult({
            endpoint: '/protected',
            success: true,
            data,
          });
        }
      }
    } catch (error) {
      setResult({
        endpoint: '/protected',
        success: false,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  /**
   * Clear the current result
   */
  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    isLoading,
    callPublic,
    callProtected,
    clearResult,
  };
}
