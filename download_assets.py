import os
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import re

def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)

def download_file(url, local_path):
    try:
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, stream=True, headers=headers)
        response.raise_for_status()
        
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        print(f"Downloaded: {local_path}")
        return True
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}")
        return False

def process_css_file(css_path, base_url):
    try:
        with open(css_path, 'r') as f:
            css_content = f.read()
        
        # Find all url() references in CSS
        url_pattern = r'url\([\'"]?([^\'"]+)[\'"]?\)'
        urls = re.findall(url_pattern, css_content)
        
        for url in urls:
            if url.startswith(('http://', 'https://')):
                full_url = url
            else:
                full_url = urljoin(base_url, url)
            
            # Create relative path for the asset
            parsed_url = urlparse(full_url)
            asset_path = os.path.join('assets', os.path.basename(parsed_url.path))
            
            # Download the asset
            create_directory(os.path.dirname(asset_path))
            if download_file(full_url, asset_path):
                # Update CSS content with relative path
                css_content = css_content.replace(url, os.path.join('..', asset_path))
        
        # Save updated CSS
        with open(css_path, 'w') as f:
            f.write(css_content)
    except Exception as e:
        print(f"Error processing CSS file {css_path}: {str(e)}")

def get_cdn_url(url):
    # Map of known CDN URLs
    cdn_mappings = {
        'bootstrap.min.css': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        'bootstrap-grid.min.css': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap-grid.min.css',
        'bootstrap-reboot.min.css': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap-reboot.min.css',
        'bootstrap.bundle.min.js': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
        'animate.css': 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    }
    
    filename = os.path.basename(urlparse(url).path)
    return cdn_mappings.get(filename, url)

def main():
    # Create base directories
    create_directory('assets')
    create_directory('assets/css')
    create_directory('assets/js')
    create_directory('assets/images')
    create_directory('assets/fonts')
    
    # Read the HTML file
    with open('index.html', 'r') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Download CSS files
    for css in soup.find_all('link', rel='stylesheet'):
        if css.get('href'):
            css_url = css['href']
            if css_url.startswith(('http://', 'https://')):
                full_url = css_url
            else:
                full_url = urljoin('https://amblyfy.com/', css_url)
            
            # Try CDN URL if available
            full_url = get_cdn_url(full_url)
            
            css_path = os.path.join('assets/css', os.path.basename(css_url))
            if download_file(full_url, css_path):
                process_css_file(css_path, full_url)
    
    # Download JavaScript files
    for script in soup.find_all('script', src=True):
        js_url = script['src']
        if js_url.startswith(('http://', 'https://')):
            full_url = js_url
        else:
            full_url = urljoin('https://amblyfy.com/', js_url)
        
        # Try CDN URL if available
        full_url = get_cdn_url(full_url)
        
        js_path = os.path.join('assets/js', os.path.basename(js_url))
        download_file(full_url, js_path)
    
    # Download images
    for img in soup.find_all('img'):
        if img.get('src'):
            img_url = img['src']
            if img_url.startswith(('http://', 'https://')):
                full_url = img_url
            else:
                full_url = urljoin('https://amblyfy.com/', img_url)
            
            img_path = os.path.join('assets/images', os.path.basename(img_url))
            download_file(full_url, img_path)
    
    # Download fonts
    for font in soup.find_all('link', rel='preload'):
        if font.get('href') and 'fonts.googleapis.com' in font['href']:
            font_url = font['href']
            font_path = os.path.join('assets/fonts', os.path.basename(font_url))
            download_file(font_url, font_path)

if __name__ == "__main__":
    main() 