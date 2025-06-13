document.addEventListener('DOMContentLoaded', function() {
    // Handle todo status updates
    document.querySelectorAll('.complete-btn, .pending-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const todoId = this.dataset.id;
            const newStatus = this.classList.contains('complete-btn') ? 'completed' : 'pending';
            
            try {
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Updating...';
                
                const response = await fetch(`/todos/${todoId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                
                if (response.ok) {
                    location.reload();
                } else {
                    throw new Error('Failed to update todo status');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to update todo. Please try again.');
                this.disabled = false;
                this.innerHTML = newStatus === 'completed' ? 
                    '<i class="fas fa-check me-1"></i>Complete' : 
                    '<i class="fas fa-undo me-1"></i>Pending';
            }
        });
    });
    
    // Handle todo deletion
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async function() {
            if (!confirm('Are you sure you want to delete this todo?')) {
                return;
            }
            
            const todoId = this.dataset.id;
            
            try {
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Deleting...';
                
                const response = await fetch(`/todos/${todoId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    // Animate removal
                    const todoCard = this.closest('.todo-card').parentElement;
                    todoCard.style.transition = 'opacity 0.3s ease';
                    todoCard.style.opacity = '0';
                    
                    setTimeout(() => {
                        location.reload();
                    }, 300);
                } else {
                    throw new Error('Failed to delete todo');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to delete todo. Please try again.');
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-trash me-1"></i>Delete';
            }
        });
    });
    
    // Auto-resize text area
    const textarea = document.getElementById('description');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                setTimeout(() => {
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
});