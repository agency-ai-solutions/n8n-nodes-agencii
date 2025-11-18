import type { AgenciiErrorResponse } from './types';

/**
 * Normalizes and formats errors from Agencii API responses
 */
export function handleAgenciiError(error: unknown): string {
	if (typeof error === 'object' && error !== null) {
		const agenciiError = error as AgenciiErrorResponse;
		
		// Check for nested error object
		if (agenciiError.error?.message) {
			return agenciiError.error.message;
		}
		
		// Check for top-level message
		if (agenciiError.message) {
			return agenciiError.message;
		}
	}
	
	// Fallback to generic error
	if (error instanceof Error) {
		return error.message;
	}
	
	return 'An unknown error occurred while communicating with Agencii API';
}

/**
 * Validates that a response contains expected fields
 */
export function validateResponse<T>(
	response: unknown,
	requiredFields: (keyof T)[],
): response is T {
	if (typeof response !== 'object' || response === null) {
		return false;
	}
	
	return requiredFields.every((field) => field in response);
}

