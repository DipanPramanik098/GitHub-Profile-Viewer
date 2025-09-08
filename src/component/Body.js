import { useEffect, useState } from "react";

function Body() {
    const [profile, setProfile] = useState([]);
    const [profileCount, setProfileCount] = useState(10);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchMode, setSearchMode] = useState("random"); // "random" or "username"

    async function generateProfile(count) {
        setLoading(true);
        setError(null);
        try {
            let since = Math.floor(Math.random() * 1000000);
            const response = await fetch(`https://api.github.com/users?per_page=${count}&since=${since}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch profiles');
            }
            
            const data = await response.json();
            setProfile(data);
            setSearchMode("random");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function searchUserByUsername() {
        if (!username.trim()) {
            setError("Please enter a username");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.github.com/users/${username.trim()}`);
            
            if (response.status === 404) {
                throw new Error(`User '${username}' not found`);
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            
            const data = await response.json();
            setProfile([data]); // Wrap in array to maintain consistency
            setSearchMode("username");
        } catch (err) {
            setError(err.message);
            setProfile([]);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const value = Math.max(1, Math.min(100, parseInt(e.target.value) || 10));
        setProfileCount(value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSearch = () => {
        generateProfile(profileCount);
    };

    const handleUsernameSearch = () => {
        searchUserByUsername();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (e.target.type === 'number') {
                handleSearch();
            } else {
                handleUsernameSearch();
            }
        }
    };

    const handleRandomSearch = () => {
        const randomCount = Math.floor(Math.random() * 30) + 1;
        setProfileCount(randomCount);
        generateProfile(randomCount);
    };

    const clearSearch = () => {
        setUsername("");
        setProfile([]);
        setError(null);
    };

    useEffect(() => {
        generateProfile(profileCount);
    }, []);

    return (
        <div className="but">
            {/* Search Mode Toggle */}
            <div className="mode-toggle">
                <button 
                    className={searchMode === "random" ? "active" : ""}
                    onClick={() => setSearchMode("random")}
                >
                    🔍 Random Users
                </button>
                <button 
                    className={searchMode === "username" ? "active" : ""}
                    onClick={() => setSearchMode("username")}
                >
                    👤 Search by Username
                </button>
            </div>

            {/* Random Users Search */}
            {searchMode === "random" && (
                <div className="searchBar">
                    <input 
                        type="number" 
                        placeholder="Enter number of profiles (1-100)"
                        value={profileCount}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        min="1"
                        max="100"
                    />
                    <button onClick={handleSearch} disabled={loading}>
                        {loading ? 'Loading...' : 'Search Profiles'}
                    </button>
                    <button onClick={handleRandomSearch} disabled={loading} className="random-btn">
                        {loading ? 'Loading...' : '🎲 Random'}
                    </button>
                </div>
            )}

            {/* Username Search */}
            {searchMode === "username" && (
                <div className="searchBar username-search">
                    <input 
                        type="text" 
                        placeholder="Enter GitHub username"
                        value={username}
                        onChange={handleUsernameChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleUsernameSearch} disabled={loading}>
                        {loading ? 'Searching...' : '🔍 Search User'}
                    </button>
                    <button onClick={clearSearch} className="clear-btn">
                        ❌ Clear
                    </button>
                </div>
            )}

            <div className="search-info">
                <p>
                    {searchMode === "random" 
                        ? `Showing ${profile.length} random GitHub profiles`
                        : profile.length > 0 
                            ? `Showing user: ${profile[0]?.login}`
                            : "No user found"
                    }
                </p>
            </div>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>
                        {searchMode === "random" 
                            ? "Fetching random GitHub profiles..."
                            : `Searching for ${username}...`
                        }
                    </p>
                </div>
            )}

            <div className="Profile">
                {profile.map((value) => (
                    <div key={value.id} className="cards">
                        <img src={value.avatar_url} alt={value.login} />
                        <h2 className="userName">{value.login}</h2>
                        <p className="user-id">ID: {value.id}</p>
                        {value.name && <p className="user-fullname">📛 {value.name}</p>}
                        {value.bio && <p className="user-bio">📝 {value.bio}</p>}
                        {value.location && <p className="user-location">📍 {value.location}</p>}
                        {value.public_repos !== undefined && (
                            <p className="user-repos">📦 Repos: {value.public_repos}</p>
                        )}
                        {value.followers !== undefined && (
                            <p className="user-followers">👥 Followers: {value.followers}</p>
                        )}
                        {value.following !== undefined && (
                            <p className="user-following">⭐ Following: {value.following}</p>
                        )}
                        <a 
                            className="profile-url" 
                            href={value.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            👁️ View Profile
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Body;