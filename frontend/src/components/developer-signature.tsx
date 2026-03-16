import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  X, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  MessageSquare,
  Code,
  Heart,
  Sparkles,
  User
} from 'lucide-react';

export function DeveloperSignature() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContactSupport = () => {
    window.open('mailto:shahbaz.imam@example.com?subject=Smart Library System - Support Request', '_blank');
  };

  return (
    <>
      {/* Floating Developer Signature Icon */}
      <motion.div
        className="fixed bottom-6 left-6 z-40"
        initial={{ scale: 0, opacity: 0, x: -50 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          delay: 2.5 // Delayed appearance to not conflict with other elements
        }}
      >
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="group relative h-14 w-14 rounded-full overflow-hidden backdrop-blur-16 bg-gradient-to-br from-[#05445e]/80 via-[#189ab4]/60 to-[#189ab4]/80 border-2 border-transparent shadow-lg shadow-[#05445e]/25"
          style={{
            background: 'linear-gradient(135deg, rgba(5, 68, 94, 0.8), rgba(24, 154, 180, 0.6), rgba(24, 154, 180, 0.8))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          whileHover={{ 
            scale: 1.15,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Gradient Border */}
          <motion.div
            className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-[#05445e] via-[#189ab4] to-[#05445e]"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#05445e]/90 via-[#189ab4]/70 to-[#189ab4]/90 backdrop-blur-16" />
          </motion.div>
          
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#05445e] to-[#189ab4] blur-xl opacity-0 group-hover:opacity-70"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Inner Glow */}
          <motion.div
            className="absolute inset-1 rounded-full bg-gradient-to-br from-[#189ab4]/30 to-[#05445e]/30 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
          
          {/* Initials */}
          <motion.span 
            className="relative z-10 text-lg font-black bg-gradient-to-br from-white via-[#d4f1f4] to-white bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace",
              textShadow: '0 0 20px rgba(212, 241, 244, 0.5)',
            }}
            whileHover={{ 
              textShadow: "0 0 25px rgba(212, 241, 244, 0.8)",
            }}
          >
            SI
          </motion.span>
          
          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-[#189ab4]/30"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          
          {/* Sparkle Effect */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3"
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1.5
            }}
          >
            <Sparkles className="w-3 h-3 text-[#d4f1f4] drop-shadow-lg" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Developer Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Modal Card */}
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 50 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 50 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="glass-card border-border/50 overflow-hidden">
                {/* Header */}
                <CardHeader className="relative bg-gradient-to-r from-[#189ab4]/10 to-[#75e6da]/10 border-b border-border/50">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,154,180,0.3),transparent_70%)]" />
                  </div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Developer Avatar */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                        className="h-12 w-12 rounded-full bg-gradient-to-r from-[#189ab4] to-[#75e6da] flex items-center justify-center text-white font-bold shadow-lg"
                      >
                        <User className="h-5 w-5" />
                      </motion.div>
                      
                      <div>
                        <CardTitle className="text-lg bg-gradient-to-r from-[#189ab4] to-[#75e6da] bg-clip-text text-transparent">
                          Developed by Shahbaz Imam
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-[#189ab4]/30">
                            <Code className="h-3 w-3 mr-1" />
                            Full Stack Developer
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsModalOpen(false)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Passionate about creating beautiful, functional applications that enhance user experiences. 
                      This Smart Library Management System combines modern design with powerful functionality.
                    </p>
                    
                    <div className="flex items-center justify-center gap-1 mt-3 text-sm text-muted-foreground">
                      <span>Made with</span>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </motion.div>
                      <span>and React</span>
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Social Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-semibold text-center">Connect & Support</h4>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {/* LinkedIn */}
                      <motion.button
                        onClick={() => handleExternalLink('https://linkedin.com/in/shahbazimam')}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-[#0077b5]/10 transition-all duration-200 group"
                      >
                        <div className="h-8 w-8 rounded-full bg-[#0077b5] flex items-center justify-center">
                          <Linkedin className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">LinkedIn Profile</div>
                          <div className="text-xs text-muted-foreground">Professional network</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#0077b5] transition-colors" />
                      </motion.button>

                      {/* GitHub */}
                      <motion.button
                        onClick={() => handleExternalLink('https://github.com/shahbazimam')}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-foreground/5 transition-all duration-200 group"
                      >
                        <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
                          <Github className="h-4 w-4 text-background" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">GitHub Repository</div>
                          <div className="text-xs text-muted-foreground">Source code & projects</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </motion.button>

                      {/* Email */}
                      <motion.button
                        onClick={() => handleExternalLink('mailto:shahbaz.imam@example.com')}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-red-500/10 transition-all duration-200 group"
                      >
                        <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Email Contact</div>
                          <div className="text-xs text-muted-foreground">shahbaz.imam@example.com</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                      </motion.button>
                    </div>
                  </motion.div>

                  <Separator />

                  {/* Contact Support Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <Button
                      onClick={handleContactSupport}
                      className="w-full bg-gradient-to-r from-[#189ab4] to-[#75e6da] hover:opacity-90 text-white font-medium"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Have questions or feedback? I'd love to hear from you!
                    </p>
                  </motion.div>

                  {/* Tech Stack Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-1 pt-2"
                  >
                    {['React', 'TypeScript', 'Tailwind', 'Framer Motion'].map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <Badge variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}