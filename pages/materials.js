$(document).ready(function () {

    // Variables
    const tbody = $("#materialsRecordsTbody");
    let materialsData = [];
    
    // Modal references
    const $reviewModal = $("#reviewModal");
    const $pdfViewer = $("#pdfViewer");

    // -----------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------
    function escapeHtml(unsafe) {
        if (unsafe === null || unsafe === undefined) return "";
        return unsafe
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    function getMaterialData($button) {
        try {
            const rawData = $button.data('material');
            return typeof rawData === 'object' ? rawData : JSON.parse(rawData);
        } catch (error) {
            console.error("Error parsing material data:", error);
            return null;
        }
    }

      // -----------------------------------------------------------------
    // Modal Systems
    // -----------------------------------------------------------------
    function showErrorModal(title, message) {
        console.log("❌ Error:", title, message);
        
        // Set modal content
        $('#errorTitle').text(title);
        $('#errorMessage').text(message);
        
        // Show modal
        $('#errorModal').removeClass('hidden');



    }

    function showSuccessModal(title, message) {
        console.log("✅ Success:", title, message);
        
        // Set modal content
        $('#successTitle').text(title);
        $('#successMessage').text(message);
        
        // Show modal
        $('#successModal').removeClass('hidden');
    }

    // -----------------------------------------------------------------
    // Modal close handlers
    // -----------------------------------------------------------------
    
    // Close success modal
    $(document).on('click', '.close-success-modal', function() {
        console.log("✅ Success modal closed");
        $('#successModal').addClass('hidden');
    });

    // Close error modal
    $(document).on('click', '.close-error-modal', function() {
        console.log("❌ Error modal closed");
        $('#errorModal').addClass('hidden');
    });

    // Close archive modal
    $(document).on('click', '.close-archive-modal', function() {
        console.log("❌ Archive modal closed");
        $('#archiveConfirmModal').addClass('hidden');
    });

    // Close republish modal  
    $(document).on('click', '.close-republish-modal', function() {
        console.log("❌ Republish modal closed");
        $('#republishConfirmModal').addClass('hidden');
    });

    // Close review modal
    $(document).on('click', '#closeModalBtn, #closeModal', function() {
        $('#reviewModal').addClass('hidden');
        $('#pdfViewer').attr('src', '');
    });
    
    // Close modals when clicking outside
    $(document).on('click', function(e) {
        if ($(e.target).is('#archiveConfirmModal')) {
            $('#archiveConfirmModal').addClass('hidden');
        }
        if ($(e.target).is('#republishConfirmModal')) {
            $('#republishConfirmModal').addClass('hidden');
        }
        if ($(e.target).is('#successModal')) {
            $('#successModal').addClass('hidden');
        }
        if ($(e.target).is('#errorModal')) {
            $('#errorModal').addClass('hidden');
        }
        if ($(e.target).is('#reviewModal')) {
            $('#reviewModal').addClass('hidden');
            $('#pdfViewer').attr('src', '');
        }
    });
















    // Archive Confirmation Modal
    function showArchiveConfirmModal(title, archiveData) {
        console.log("📋 Showing archive modal for:", title);
        
        // Set modal content
        $('#archiveConfirmTitle').text(`Archive "${title}"`);
        $('#archiveConfirmMessage').text(`Are you sure you want to archive "${title}"? This will download the file and change its status to "Archived", removing it from active materials.`);
        
        // Remove previous click handlers and add new ones
        $('.confirm-archive').off('click').on('click', function() {
            console.log("✅ Archive confirmed for:", title);
            processArchive(archiveData);
            $('#archiveConfirmModal').addClass('hidden');
        });

        // Show modal
        $('#archiveConfirmModal').removeClass('hidden');
    }

    // Republish Confirmation Modal
    function showRepublishConfirmModal(title, republishData) {
        console.log("📋 Showing republish modal for:", title);
        
        // Set modal content
        $('#republishConfirmTitle').text(`Republish "${title}"`);
        $('#republishConfirmMessage').text(`Are you sure you want to republish "${title}"? This will change its status to "Available", making it visible to students and allowing borrowing requests.`);
        
        // Remove previous click handlers and add new ones
        $('.confirm-republish').off('click').on('click', function() {
            console.log("✅ Republish confirmed for:", title);
            processRepublish(republishData);
            $('#republishConfirmModal').addClass('hidden');
        });

        // Show modal
        $('#republishConfirmModal').removeClass('hidden');
    }

    // -----------------------------------------------------------------
    // Process Actions
    // -----------------------------------------------------------------
    function processArchive(archiveData) {
        const { id, filePath, title } = archiveData;
        
        console.log("🔄 Processing archive for ID:", id);
        
        // Step 1: Trigger download
        if (filePath) {
            const fileName = filePath.split('/').pop();
            const downloadUrl = `pages/download_file.php?file=${encodeURIComponent(fileName)}`;
            console.log("📥 Downloading:", downloadUrl);
            window.open(downloadUrl, '_blank');
        }
        
        // Step 2: Update database status to "Archived"
        $.ajax({
            url: 'pages/archive_material.php',
            type: 'POST',
            data: { 
                material_id: id,
                action: 'archive'
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showSuccessModal('Material Archived', 
                        `"${title}" has been successfully archived.\n\nStatus: Archived\nFile download started.`);
                    
                    // Refresh the materials list to reflect the change
                    setTimeout(() => {
                        loadPublishedMaterials();
                    }, 1500);
                } else {
                    showErrorModal('Archive Failed', response.error || 'Failed to archive material');
                }
            },
            error: function(xhr, status, error) {
                showErrorModal('Archive Failed', 'Failed to update material status: ' + error);
            }
        });
    }

    function processRepublish(republishData) {
        const { id, title } = republishData;
        
        console.log("🔄 Processing republish for ID:", id);
        
        // Update database status to "Available"
        $.ajax({
            url: 'pages/archive_material.php',
            type: 'POST',
            data: { 
                material_id: id,
                action: 'republish'
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showSuccessModal('Material Republished', 
                        `"${title}" has been successfully republished.\n\nStatus: Available\nMaterial is now visible to students and can be borrowed.`);
                    
                    // Refresh the materials list to reflect the change
                    setTimeout(() => {
                        loadPublishedMaterials();
                    }, 1500);
                } else {
                    showErrorModal('Republish Failed', response.error || 'Failed to republish material');
                }
            },
            error: function(xhr, status, error) {
                showErrorModal('Republish Failed', 'Failed to update material status: ' + error);
            }
        });
    }

    // -----------------------------------------------------------------
    // Load Published Materials
    // -----------------------------------------------------------------
    function loadPublishedMaterials() {
        console.log('🔄 Loading published materials...');
        tbody.html(`<tr><td colspan="12" class="text-center py-4 text-gray-500">Loading published materials...</td></tr>`);

        $.ajax({
            url: "pages/get_librarianPublishedMaterial.php",
            type: "GET",
            cache: false,
            dataType: "json",
            success: function (response) {
                if (response && response.success) {
                    materialsData = response.data || [];
                    console.log("📊 Loaded materials:", materialsData.length);
                    renderMaterialsTable(materialsData);
                    initializeSearch();
                } else {
                    const errorMsg = response?.error || 'Failed to load published materials';
                    showErrorModal('Load Failed', errorMsg);
                    tbody.html(`<tr><td colspan="12" class="text-center text-red-600 py-4">${errorMsg}</td></tr>`);
                }
            },
            error: function (xhr, status, err) {
                showErrorModal('Load Failed', 'Error loading published materials');
                tbody.html(`<tr><td colspan="12" class="text-center text-red-600 py-4">Error loading materials</td></tr>`);
            }
        });
    }

    // -----------------------------------------------------------------
    // Render Materials Table
    // -----------------------------------------------------------------
    function renderMaterialsTable(data) {
        console.log("🎨 Rendering data:", data.length, "items");
        tbody.empty();

        if (!data || data.length === 0) {
            tbody.append(`<tr><td colspan="12" class="text-center py-8 text-gray-500">No published materials found.</td></tr>`);
            return;
        }

        data.forEach(function (item, index) {
            const fileName = item.materialFile ? item.materialFile.split('/').pop() : 'No file';
            const fileLink = item.materialFile ? 
                `<a href="view_file.php?file=${encodeURIComponent(item.materialFile)}" class="text-blue-600 hover:text-blue-800 underline text-xs" target="_blank">${escapeHtml(fileName)}</a>` :
                '<span class="text-gray-500 text-xs">No file</span>';

            const row = `
                <tr class="border-b hover:bg-gray-50" data-id="${item.materialPublishing_id}">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.callNumber || 'N/A')}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(item.materialName || 'No title')}</td>
                    <td class="px-4 py-3 text-sm truncate max-w-xs" title="${escapeHtml(item.materialDescription)}">
                        ${escapeHtml(item.materialDescription && item.materialDescription.length > 80 ? 
                            item.materialDescription.substring(0, 77) + '...' : 
                            (item.materialDescription || 'No description'))}
                    </td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(item.author_fullname || 'Unknown author')}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(item.materialTypeName || item.materialType_id || 'Unknown type')}</td>
                    <td class="px-4 py-3 text-sm">${fileLink}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(item.submitted_by_name || item.submitted_by_username || 'Unknown')}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(item.submitter_college || 'N/A')}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(item.submitter_course || 'N/A')}</td>
                    <td class="px-4 py-3 text-sm">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold border rounded-full ${
                        item.materialStatus === 'Available' ? 'border-green-600 bg-green-100 text-green-800' :
                        item.materialStatus === 'Borrowed' ? 'border-yellow-800 bg-yellow-100 text-yellow-800' :
                        item.materialStatus === 'Reserved' ? 'border-blue-800 bg-blue-100 text-blue-800' :
                        item.materialStatus === 'Archived' ? 'border-gray-400 bg-gray-200 text-gray-600' :
                        'border-gray-300 bg-gray-100 text-gray-800'
                    }">
                        ${escapeHtml(item.materialStatus || 'Unknown')}
                    </span>
                    </td>
                    <td class="px-4 py-3 text-sm">${formatDate(item.librarianPublishingDate)}</td>
                    <td class="px-4 py-3 text-center">
                        <div class="relative inline-block text-left">
                            <button class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none"
                                    data-material='${escapeHtml(JSON.stringify(item))}'>
                                Manage ▾
                            </button>
                        </div>
                    </td>
                </tr>`;
            tbody.append(row);
        });

        console.log("✅ Table rendered successfully");
        initializeDropdowns();
    }

    // -----------------------------------------------------------------
    // Search Functionality
    // -----------------------------------------------------------------
    function initializeSearch() {
        $("#searchMaterials").on("input", function () {
            filterMaterials();
        });
    }

    function filterMaterials() {
        const term = $("#searchMaterials").val().toLowerCase().trim();
        
        if (!materialsData.length) return;

        if (!term) {
            renderMaterialsTable(materialsData);
            return;
        }

        const filtered = materialsData.filter((item) => {
            const searchable = [
                item.callNumber || "",
                item.materialName || "",
                item.author_fullname || "",
                item.materialDescription || "",
                item.materialTypeName || "",
                item.submitted_by_name || "",
                item.submitter_college || "",
                item.submitter_course || ""
            ].map(str => str.toLowerCase());

            return searchable.some(text => text.includes(term));
        });

        renderMaterialsTable(filtered);
    }

    // -----------------------------------------------------------------
    // Dropdowns - SIMPLIFIED VERSION
    // -----------------------------------------------------------------
    function initializeDropdowns() {
        console.log("🔄 Initializing materials dropdowns...");
        
        // Remove any existing handlers
        $(document).off("click", ".manage-btn");
        $(document).off("click", ".view-material-portal");
        $(document).off("click", ".archive-material-portal");
        $(document).off("click", ".republish-material-portal");

        // Manage button click
        $(document).on("click", ".manage-btn", function (e) {
            e.stopPropagation();
            e.preventDefault();
            
            const $button = $(this);
            const buttonRect = $button[0].getBoundingClientRect();
            const materialData = getMaterialData($button);
            
            if (!materialData) {
                console.error("❌ Material data not found");
                return;
            }
            
            console.log("🎯 Manage button clicked for material:", materialData.materialName);
            
            // Remove existing dropdown
            $(".materials-dropdown-portal").remove();
            
            const materialId = materialData.materialPublishing_id;
            const isArchived = materialData.materialStatus === 'Archived';
            
            // Create dropdown based on status
let dropdownHtml = '';
if (isArchived) {
    // Archived material - show republish option
    dropdownHtml = `
        <div class="materials-dropdown-portal fixed z-50" 
            style="top: ${buttonRect.bottom + 5}px; left: ${buttonRect.left - 96}px;"
            data-material-id="${materialId}">
            <div class="w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 view-material-portal" 
                    data-id="${materialId}">View File</a>
                <a href="#" class="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100 republish-material-portal"
                    data-id="${materialId}" data-title="${escapeHtml(materialData.materialName)}">Republish Material</a>
            </div>
        </div>
    `;
} else {
    // Available material - show archive option
    dropdownHtml = `
        <div class="materials-dropdown-portal fixed z-50" 
            style="top: ${buttonRect.bottom + 5}px; left: ${buttonRect.left - 192}px;"
            data-material-id="${materialId}">
            <div class="w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 view-material-portal" 
                    data-id="${materialId}">View File</a>
                <a href="#" class="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 archive-material-portal"
                    data-id="${materialId}" 
                    data-file="${materialData.materialFile}" 
                    data-title="${escapeHtml(materialData.materialName)}">Archive Material</a>
            </div>
        </div>
    `;
}
            
            $("body").append(dropdownHtml);
            console.log("✅ Dropdown portal created");
        });

        // View File
        $(document).on("click", ".view-material-portal", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("👁️ Viewing material ID:", id);
            
            const material = materialsData.find(item => item.materialPublishing_id == id);
            if (!material || !material.materialFile) {
                showErrorModal('View Failed', 'No file available for this material');
                $(".materials-dropdown-portal").remove();
                return;
            }

            const fileName = material.materialFile.split('/').pop();
            const pdfUrl = 'pages/view_pdf.php?file=' + encodeURIComponent(fileName) + '&t=' + Date.now();
            
            $('#pdfLoading').removeClass('hidden');
            $('#pdfViewer').attr('src', pdfUrl);
            $('#reviewModal').removeClass('hidden');
            $(".materials-dropdown-portal").remove();
            
            $('#pdfViewer').on('load', function() {
                $('#pdfLoading').addClass('hidden');
            });
        });

        // Archive Material
        $(document).on("click", ".archive-material-portal", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            const filePath = $(this).data("file");
            const title = $(this).data("title");
            
            console.log("📦 Archive clicked for:", title, "ID:", id);
            
            // Store the data for later use
            const archiveData = { id, filePath, title };
            
            // Show custom confirmation modal
            showArchiveConfirmModal(title, archiveData);
            
            $(".materials-dropdown-portal").remove();
        });

        // Republish Material
        $(document).on("click", ".republish-material-portal", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            const title = $(this).data("title");
            
            console.log("🔄 Republish clicked for:", title, "ID:", id);
            
            // Store the data for later use
            const republishData = { id, title };
            
            // Show custom confirmation modal
            showRepublishConfirmModal(title, republishData);
            
            $(".materials-dropdown-portal").remove();
        });

        // Close dropdown when clicking outside
        $(document).on("click", function (e) {
            if (!$(e.target).closest(".manage-btn").length && 
                !$(e.target).closest(".materials-dropdown-portal").length) {
                $(".materials-dropdown-portal").remove();
            }
        });
    }

    // -----------------------------------------------------------------
    // Modal close handlers
    // -----------------------------------------------------------------
    
    // Close archive modal
    $(document).on('click', '.close-archive-modal', function() {
        console.log("❌ Archive modal closed");
        $('#archiveConfirmModal').addClass('hidden');
    });

    // Close republish modal  
    $(document).on('click', '.close-republish-modal', function() {
        console.log("❌ Republish modal closed");
        $('#republishConfirmModal').addClass('hidden');
    });

    // Close review modal
    $(document).on('click', '#closeModalBtn, #closeModal', function() {
        $('#reviewModal').addClass('hidden');
        $('#pdfViewer').attr('src', '');
    });
    
    $(document).on('click', '#reviewModal', function(e) {
        if (e.target === this) {
            $('#reviewModal').addClass('hidden');
            $('#pdfViewer').attr('src', '');
        }
    });

    // Close modals when clicking outside
    $(document).on('click', function(e) {
        if ($(e.target).is('#archiveConfirmModal')) {
            $('#archiveConfirmModal').addClass('hidden');
        }
        if ($(e.target).is('#republishConfirmModal')) {
            $('#republishConfirmModal').addClass('hidden');
        }
    });

    // -----------------------------------------------------------------
    // Initialization
    // -----------------------------------------------------------------
    function initializePage() {
        console.log("🚀 Initializing Materials Records page...");
        loadPublishedMaterials();
    }

    // Start the application
    initializePage();
});